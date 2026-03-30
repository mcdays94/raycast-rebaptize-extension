import {
  ActionPanel,
  Action,
  Form,
  List,
  Icon,
  showToast,
  Toast,
  useNavigation,
  confirmAlert,
  Alert,
  Color,
} from "@raycast/api";
import { useState, useEffect } from "react";
import { readdir, stat, mkdir, rename as fsRename } from "fs/promises";
import { join, extname } from "path";
import { parseEpisode, assignSeasons, type ParsedEpisode } from "./episode-parser";
import { hasTvdbKey, searchShow, buildEpisodeMap, type ShowInfo } from "./tvdb";

function isHidden(name: string): boolean {
  return name.startsWith(".");
}

interface OrganizedFile {
  original: string;
  season: number;
  episodeInSeason: number;
  newName: string;
  folder: string;
}

function padNumber(n: number, width: number): string {
  return String(n).padStart(width, "0");
}

function PreviewList({ folderPath, files }: { folderPath: string; files: OrganizedFile[] }) {
  const seasons = [...new Set(files.map((f) => f.season))].sort((a, b) => a - b);

  async function doOrganize() {
    const confirmed = await confirmAlert({
      title: `Rename and sort ${files.length} files into ${seasons.length} season folders?`,
      message: "Files will be renamed and moved. This cannot be undone.",
      primaryAction: { title: "Organize", style: Alert.ActionStyle.Destructive },
    });
    if (!confirmed) return;

    try {
      await showToast({ style: Toast.Style.Animated, title: "Organizing..." });

      for (const f of files) {
        const targetDir = join(folderPath, f.folder);
        await mkdir(targetDir, { recursive: true });
        await fsRename(join(folderPath, f.original), join(targetDir, f.newName));
      }

      await showToast({ style: Toast.Style.Success, title: "Done!", message: `${files.length} episodes organized` });
    } catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Failed",
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return (
    <List navigationTitle="Episode Preview">
      {seasons.map((s) => {
        const seasonFiles = files.filter((f) => f.season === s);
        return (
          <List.Section key={s} title={`Season ${padNumber(s, 2)}`} subtitle={`${seasonFiles.length} episodes`}>
            {seasonFiles.map((f, i) => (
              <List.Item
                key={i}
                icon={{ source: Icon.ArrowRight, tintColor: Color.Blue }}
                title={f.original}
                subtitle={`→ ${f.folder}/${f.newName}`}
                actions={
                  <ActionPanel>
                    <Action title="Organize All" icon={Icon.Checkmark} onAction={doOrganize} />
                  </ActionPanel>
                }
              />
            ))}
          </List.Section>
        );
      })}
    </List>
  );
}

export default function SmartOrganize() {
  const { push } = useNavigation();
  const tvdbAvailable = hasTvdbKey();

  const [showName, setShowName] = useState("");
  const [useTvdb, setUseTvdb] = useState(false);
  const [epsPerSeason, setEpsPerSeason] = useState("12");
  const [folderTemplate, setFolderTemplate] = useState("Season {season}");
  const [fileTemplate, setFileTemplate] = useState("{show}.S{season}E{episode}");

  // TVDB search state
  const [tvdbResults, setTvdbResults] = useState<ShowInfo[]>([]);
  const [selectedShowId, setSelectedShowId] = useState<string>("");
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!useTvdb || !tvdbAvailable || showName.length < 2) {
      setTvdbResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const results = await searchShow(showName);
        setTvdbResults(results);
        if (results.length > 0 && !selectedShowId) {
          setSelectedShowId(String(results[0].id));
        }
      } catch {
        // TVDB search failed, not critical
      }
      setSearching(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [showName, useTvdb]);

  async function handleSubmit(values: { folder: string[] }) {
    const folderPaths = values.folder;
    if (!folderPaths || folderPaths.length === 0) {
      await showToast({ style: Toast.Style.Failure, title: "No folder selected" });
      return;
    }
    const folderPath = folderPaths[0];

    if (!showName.trim()) {
      await showToast({ style: Toast.Style.Failure, title: "Show name is required" });
      return;
    }

    try {
      await showToast({ style: Toast.Style.Animated, title: "Scanning files..." });

      // Read files
      const entries = await readdir(folderPath);
      const files: string[] = [];
      for (const entry of entries) {
        if (isHidden(entry)) continue;
        const s = await stat(join(folderPath, entry));
        if (s.isFile()) files.push(entry);
      }

      if (files.length === 0) {
        await showToast({ style: Toast.Style.Failure, title: "No files found" });
        return;
      }

      // Parse episodes
      const parsed: ParsedEpisode[] = [];
      const unparsed: string[] = [];
      for (const f of files) {
        const result = parseEpisode(f);
        if (result) {
          parsed.push(result);
        } else {
          unparsed.push(f);
        }
      }

      if (parsed.length === 0) {
        await showToast({
          style: Toast.Style.Failure,
          title: "No episode numbers detected",
          message: "Could not find episode numbers in any filenames.",
        });
        return;
      }

      // Determine season/episode mapping
      let episodeMap: Map<number, { season: number; episode: number; name?: string }>;

      if (useTvdb && tvdbAvailable && selectedShowId) {
        // Use TVDB data
        try {
          await showToast({ style: Toast.Style.Animated, title: "Fetching episode data from TheTVDB..." });
          const tvdbMap = await buildEpisodeMap(parseInt(selectedShowId));
          episodeMap = new Map();
          for (const [absEp, info] of tvdbMap) {
            episodeMap.set(absEp, { season: info.season, episode: info.episode, name: info.name });
          }
        } catch (error) {
          await showToast({
            style: Toast.Style.Failure,
            title: "TVDB fetch failed, falling back to manual split",
            message: error instanceof Error ? error.message : String(error),
          });
          // Fallback
          const epNumbers = parsed.map((p) => p.episodeNumber);
          const seasonMap = assignSeasons(epNumbers, parseInt(epsPerSeason) || 12);
          episodeMap = new Map();
          for (const [ep, info] of seasonMap) {
            episodeMap.set(ep, { season: info.season, episode: info.episodeInSeason });
          }
        }
      } else {
        // Manual split by episodes per season
        // If the parser already found season numbers, use those
        const hasSeasons = parsed.some((p) => p.seasonNumber !== null);

        if (hasSeasons) {
          episodeMap = new Map();
          for (const p of parsed) {
            episodeMap.set(p.episodeNumber, {
              season: p.seasonNumber ?? 1,
              episode: p.episodeNumber,
            });
          }
        } else {
          const epNumbers = parsed.map((p) => p.episodeNumber);
          const seasonMap = assignSeasons(epNumbers, parseInt(epsPerSeason) || 12);
          episodeMap = new Map();
          for (const [ep, info] of seasonMap) {
            episodeMap.set(ep, { season: info.season, episode: info.episodeInSeason });
          }
        }
      }

      // Build organized file list
      const show = showName.trim().replace(/\s+/g, ".");
      const organized: OrganizedFile[] = [];

      for (const p of parsed) {
        const mapping = episodeMap.get(p.episodeNumber);
        if (!mapping) continue;

        const ext = extname(p.fileName);

        const folder = folderTemplate
          .replace("{season}", padNumber(mapping.season, 2))
          .replace("{show}", show);

        const newName =
          fileTemplate
            .replace("{show}", show)
            .replace("{season}", padNumber(mapping.season, 2))
            .replace("{episode}", padNumber(mapping.episode, 2)) + ext;

        organized.push({
          original: p.fileName,
          season: mapping.season,
          episodeInSeason: mapping.episode,
          newName,
          folder,
        });
      }

      organized.sort((a, b) => a.season - b.season || a.episodeInSeason - b.episodeInSeason);

      if (unparsed.length > 0) {
        await showToast({
          style: Toast.Style.Success,
          title: `${parsed.length} episodes detected`,
          message: `${unparsed.length} files could not be parsed and will be skipped.`,
        });
      }

      push(<PreviewList folderPath={folderPath} files={organized} />);
    } catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Error",
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return (
    <Form
      navigationTitle="Smart Organize Episodes"
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Scan and Preview" icon={Icon.Eye} onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.FilePicker
        id="folder"
        title="Folder"
        allowMultipleSelection={false}
        canChooseDirectories
        canChooseFiles={false}
      />

      <Form.TextField
        id="showName"
        title="Show / Anime Name"
        placeholder="Jujutsu Kaisen"
        value={showName}
        onChange={setShowName}
      />

      <Form.Separator />

      {tvdbAvailable && (
        <Form.Checkbox
          id="useTvdb"
          label="Use TheTVDB for season/episode data"
          value={useTvdb}
          onChange={setUseTvdb}
        />
      )}

      {useTvdb && tvdbAvailable && tvdbResults.length > 0 && (
        <Form.Dropdown
          id="tvdbShow"
          title="TVDB Match"
          value={selectedShowId}
          onChange={setSelectedShowId}
          isLoading={searching}
        >
          {tvdbResults.map((r) => (
            <Form.Dropdown.Item
              key={r.id}
              value={String(r.id)}
              title={`${r.name}${r.firstAirDate ? ` (${r.firstAirDate.slice(0, 4)})` : ""}`}
            />
          ))}
        </Form.Dropdown>
      )}

      {(!useTvdb || !tvdbAvailable) && (
        <Form.TextField
          id="epsPerSeason"
          title="Episodes per Season"
          placeholder="12"
          value={epsPerSeason}
          onChange={setEpsPerSeason}
          info="Used to split flat episode numbers (1-50) into seasons. Ignored if filenames already contain season info (S01E01)."
        />
      )}

      <Form.Separator />

      <Form.TextField
        id="folderTemplate"
        title="Folder Template"
        placeholder="Season {season}"
        value={folderTemplate}
        onChange={setFolderTemplate}
        info="Variables: {show}, {season}"
      />

      <Form.TextField
        id="fileTemplate"
        title="File Template"
        placeholder="{show}.S{season}E{episode}"
        value={fileTemplate}
        onChange={setFileTemplate}
        info="Variables: {show}, {season}, {episode}. Extension is added automatically."
      />

      <Form.Description
        title="How It Works"
        text={`Scans filenames for episode numbers (supports S01E01, 001, EP01, anime formats, etc.), ${tvdbAvailable ? "optionally fetches season data from TheTVDB, " : ""}then renames and sorts files into season folders.\n\nFiles that can't be parsed are left untouched.`}
      />

      {!tvdbAvailable && (
        <Form.Description
          title="TheTVDB Integration"
          text="Add a TVDB API key in the extension preferences to enable automatic season/episode lookup. Get a free key at thetvdb.com."
        />
      )}
    </Form>
  );
}
