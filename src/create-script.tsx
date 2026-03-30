import {
  ActionPanel,
  Action,
  Form,
  List,
  Icon,
  showToast,
  Toast,
  useNavigation,
  Color,
  showHUD,
} from "@raycast/api";
import { useState } from "react";
import { randomUUID } from "crypto";
import {
  type StepType,
  type ScriptStep,
  type RenameScript,
  saveScript,
  executeScript,
  stepLabel,
  stepTypeLabel,
} from "./scripts";
import { getFinderFolder } from "./finder";
import { readdir, stat } from "fs/promises";
import { join } from "path";

// ─── Step Configuration Form ───

function AddStepForm({ onAdd }: { onAdd: (step: ScriptStep) => void }) {
  const { pop } = useNavigation();
  const [stepType, setStepType] = useState<StepType>("swap-delimiter");

  // Swap delimiter
  const [fromDel, setFromDel] = useState(".");
  const [toDel, setToDel] = useState(" ");
  // Find & Replace
  const [find, setFind] = useState("");
  const [replace, setReplace] = useState("");
  const [useRegex, setUseRegex] = useState(false);
  // Change extension
  const [fromExt, setFromExt] = useState("");
  const [toExt, setToExt] = useState("");
  // TV Show
  const [showName, setShowName] = useState("");
  const [season, setSeason] = useState("1");
  const [startEp, setStartEp] = useState("1");
  const [wordDel, setWordDel] = useState(" ");
  const [suffix, setSuffix] = useState("");
  // Anime
  const [animeName, setAnimeName] = useState("");
  const [startAnimeEp, setStartAnimeEp] = useState("1");
  const [group, setGroup] = useState("");
  const [quality, setQuality] = useState("");
  // Movie
  const [movieName, setMovieName] = useState("");
  const [year, setYear] = useState("");
  const [movieQuality, setMovieQuality] = useState("");
  // Sequential / Enumerate
  const [prefix, setPrefix] = useState("");
  const [startNum, setStartNum] = useState("1");
  const [zeroPad, setZeroPad] = useState("3");
  const [separator, setSeparator] = useState("-");

  function buildStep(): ScriptStep {
    const step: ScriptStep = { type: stepType };
    switch (stepType) {
      case "swap-delimiter":
        step.fromDelimiter = fromDel;
        step.toDelimiter = toDel;
        break;
      case "find-replace":
        step.find = find;
        step.replace = replace;
        step.useRegex = useRegex;
        break;
      case "change-extension":
        step.fromExtension = fromExt;
        step.toExtension = toExt;
        break;
      case "tv-show":
        step.showName = showName || "Show";
        step.season = parseInt(season) || 1;
        step.startEpisode = parseInt(startEp) || 1;
        step.wordDelimiter = wordDel;
        step.suffix = suffix;
        break;
      case "anime":
        step.animeName = animeName || "Anime";
        step.startAnimeEpisode = parseInt(startAnimeEp) || 1;
        step.group = group;
        step.quality = quality;
        break;
      case "movie":
        step.movieName = movieName || "Movie";
        step.year = year;
        step.movieQuality = movieQuality;
        step.wordDelimiter = wordDel;
        break;
      case "sequential":
      case "enumerate":
        step.prefix = prefix;
        step.startNumber = parseInt(startNum) || 1;
        step.zeroPad = parseInt(zeroPad) || 3;
        step.separator = separator;
        break;
    }
    return step;
  }

  return (
    <Form
      navigationTitle="Add Step"
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title="Add Step"
            icon={Icon.Plus}
            onSubmit={() => {
              onAdd(buildStep());
              pop();
            }}
          />
        </ActionPanel>
      }
    >
      <Form.Dropdown id="stepType" title="Step Type" value={stepType} onChange={(v) => setStepType(v as StepType)}>
        <Form.Dropdown.Section title="Case">
          <Form.Dropdown.Item value="uppercase" title="UPPERCASE" />
          <Form.Dropdown.Item value="lowercase" title="lowercase" />
          <Form.Dropdown.Item value="titlecase" title="Title Case" />
          <Form.Dropdown.Item value="sentencecase" title="Sentence Case" />
        </Form.Dropdown.Section>
        <Form.Dropdown.Section title="Clean Up">
          <Form.Dropdown.Item value="collapse-spaces" title="Collapse Multiple Spaces" />
          <Form.Dropdown.Item value="swap-delimiter" title="Swap Delimiter" />
          <Form.Dropdown.Item value="find-replace" title="Find & Replace" />
          <Form.Dropdown.Item value="change-extension" title="Change Extension" />
        </Form.Dropdown.Section>
        <Form.Dropdown.Section title="Rename Format">
          <Form.Dropdown.Item value="tv-show" title="Rename as TV Show" />
          <Form.Dropdown.Item value="anime" title="Rename as Anime" />
          <Form.Dropdown.Item value="movie" title="Rename as Movie" />
          <Form.Dropdown.Item value="sequential" title="Rename Sequentially" />
          <Form.Dropdown.Item value="enumerate" title="Auto Enumerate" />
        </Form.Dropdown.Section>
      </Form.Dropdown>

      <Form.Separator />

      {stepType === "swap-delimiter" && (
        <>
          <Form.TextField id="fromDel" title="From" placeholder="." value={fromDel} onChange={setFromDel} />
          <Form.TextField id="toDel" title="To" placeholder=" " value={toDel} onChange={setToDel} />
        </>
      )}

      {stepType === "find-replace" && (
        <>
          <Form.TextField id="find" title="Find" placeholder="pattern" value={find} onChange={setFind} />
          <Form.TextField id="replace" title="Replace" placeholder="" value={replace} onChange={setReplace} />
          <Form.Checkbox id="useRegex" label="Regular Expression" value={useRegex} onChange={setUseRegex} />
        </>
      )}

      {stepType === "change-extension" && (
        <>
          <Form.TextField id="fromExt" title="From Extension" placeholder="jpeg (empty = all)" value={fromExt} onChange={setFromExt} />
          <Form.TextField id="toExt" title="To Extension" placeholder="jpg" value={toExt} onChange={setToExt} />
        </>
      )}

      {stepType === "tv-show" && (
        <>
          <Form.TextField id="showName" title="Show Name" placeholder="Breaking Bad" value={showName} onChange={setShowName} />
          <Form.TextField id="season" title="Season" placeholder="1" value={season} onChange={setSeason} />
          <Form.TextField id="startEp" title="Start Episode" placeholder="1" value={startEp} onChange={setStartEp} />
          <Form.Dropdown id="wordDel" title="Word Separator" value={wordDel} onChange={setWordDel}>
            <Form.Dropdown.Item value=" " title="Space" />
            <Form.Dropdown.Item value="." title="Dot" />
            <Form.Dropdown.Item value="_" title="Underscore" />
            <Form.Dropdown.Item value="-" title="Dash" />
          </Form.Dropdown>
          <Form.TextField id="suffix" title="Suffix (Optional)" placeholder="1080p" value={suffix} onChange={setSuffix} />
        </>
      )}

      {stepType === "anime" && (
        <>
          <Form.TextField id="animeName" title="Anime Name" placeholder="Jujutsu Kaisen" value={animeName} onChange={setAnimeName} />
          <Form.TextField id="startAnimeEp" title="Start Episode" placeholder="1" value={startAnimeEp} onChange={setStartAnimeEp} />
          <Form.TextField id="group" title="Sub Group (Optional)" placeholder="SubsPlease" value={group} onChange={setGroup} />
          <Form.TextField id="quality" title="Quality (Optional)" placeholder="1080p" value={quality} onChange={setQuality} />
        </>
      )}

      {stepType === "movie" && (
        <>
          <Form.TextField id="movieName" title="Movie Name" placeholder="Interstellar" value={movieName} onChange={setMovieName} />
          <Form.TextField id="year" title="Year" placeholder="2014" value={year} onChange={setYear} />
          <Form.TextField id="movieQuality" title="Quality" placeholder="1080p" value={movieQuality} onChange={setMovieQuality} />
        </>
      )}

      {(stepType === "sequential" || stepType === "enumerate") && (
        <>
          <Form.TextField id="prefix" title="Prefix" placeholder="photo" value={prefix} onChange={setPrefix} />
          <Form.TextField id="startNum" title="Start Number" placeholder="1" value={startNum} onChange={setStartNum} />
          <Form.TextField id="zeroPad" title="Zero Padding" placeholder="3" value={zeroPad} onChange={setZeroPad} />
          <Form.Dropdown id="separator" title="Separator" value={separator} onChange={setSeparator}>
            <Form.Dropdown.Item value="-" title="Dash (-)" />
            <Form.Dropdown.Item value="_" title="Underscore (_)" />
            <Form.Dropdown.Item value="." title="Dot (.)" />
            <Form.Dropdown.Item value=" " title="Space" />
          </Form.Dropdown>
        </>
      )}

      {/* No-config steps */}
      {["uppercase", "lowercase", "titlecase", "sentencecase", "collapse-spaces"].includes(stepType) && (
        <Form.Description title="" text="This step has no additional configuration." />
      )}
    </Form>
  );
}

// ─── Main Create Script Command ───

export default function CreateScript() {
  const { push, pop } = useNavigation();
  const [scriptName, setScriptName] = useState("");
  const [description, setDescription] = useState("");
  const [fileFilter, setFileFilter] = useState("");
  const [steps, setSteps] = useState<ScriptStep[]>([]);

  function addStep(step: ScriptStep) {
    setSteps([...steps, step]);
  }

  function removeStep(index: number) {
    setSteps(steps.filter((_, i) => i !== index));
  }

  function moveStepUp(index: number) {
    if (index === 0) return;
    const newSteps = [...steps];
    [newSteps[index - 1], newSteps[index]] = [newSteps[index], newSteps[index - 1]];
    setSteps(newSteps);
  }

  function moveStepDown(index: number) {
    if (index >= steps.length - 1) return;
    const newSteps = [...steps];
    [newSteps[index], newSteps[index + 1]] = [newSteps[index + 1], newSteps[index]];
    setSteps(newSteps);
  }

  async function handleSave() {
    if (!scriptName.trim()) {
      await showToast({ style: Toast.Style.Failure, title: "Script name is required" });
      return;
    }
    if (steps.length === 0) {
      await showToast({ style: Toast.Style.Failure, title: "Add at least one step" });
      return;
    }

    const script: RenameScript = {
      id: randomUUID(),
      name: scriptName.trim(),
      description: description.trim(),
      fileFilter: fileFilter.trim(),
      steps,
      createdAt: Date.now(),
    };

    await saveScript(script);
    await showHUD(`Script "${script.name}" saved`);
  }

  async function handlePreview() {
    if (steps.length === 0) {
      await showToast({ style: Toast.Style.Failure, title: "Add at least one step" });
      return;
    }

    const folderPath = await getFinderFolder();
    if (!folderPath) {
      await showToast({ style: Toast.Style.Failure, title: "Open a Finder window to preview" });
      return;
    }

    const entries = await readdir(folderPath);
    const files: string[] = [];
    for (const entry of entries) {
      if (entry.startsWith(".")) continue;
      const s = await stat(join(folderPath, entry));
      if (s.isFile()) files.push(entry);
    }
    files.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));

    const script: RenameScript = {
      id: "preview",
      name: "Preview",
      description: "",
      fileFilter: fileFilter.trim(),
      steps,
      createdAt: Date.now(),
    };

    const results = executeScript(files, script);

    push(
      <List navigationTitle="Script Preview">
        {results.map((r, i) => {
          const changed = r.original !== r.renamed;
          return (
            <List.Item
              key={i}
              icon={{
                source: !r.matched ? Icon.Minus : changed ? Icon.ArrowRight : Icon.Checkmark,
                tintColor: !r.matched ? Color.SecondaryText : changed ? Color.Blue : Color.Green,
              }}
              title={r.original}
              subtitle={r.matched ? (changed ? `→ ${r.renamed}` : "(unchanged)") : "(filtered out)"}
            />
          );
        })}
      </List>,
    );
  }

  return (
    <List
      navigationTitle="Create Rename Script"
      searchBarPlaceholder="Script pipeline..."
      actions={
        <ActionPanel>
          <Action title="Add Step" icon={Icon.Plus} onAction={() => push(<AddStepForm onAdd={addStep} />)} />
          <Action title="Preview on Finder Folder" icon={Icon.Eye} onAction={handlePreview} shortcut={{ modifiers: ["cmd"], key: "p" }} />
          <Action title="Save Script" icon={Icon.SaveDocument} onAction={handleSave} shortcut={{ modifiers: ["cmd"], key: "s" }} />
        </ActionPanel>
      }
    >
      <List.Section title="Script Info">
        <List.Item
          icon={Icon.Pencil}
          title={scriptName || "Untitled Script"}
          subtitle={description || "No description"}
          accessories={[{ text: fileFilter ? `Filter: ${fileFilter}` : "All files" }]}
          actions={
            <ActionPanel>
              <Action
                title="Edit Script Info"
                icon={Icon.Pencil}
                onAction={() =>
                  push(
                    <Form
                      navigationTitle="Script Info"
                      actions={
                        <ActionPanel>
                          <Action.SubmitForm
                            title="Done"
                            onSubmit={(values: { name: string; desc: string; filter: string }) => {
                              setScriptName(values.name);
                              setDescription(values.desc);
                              setFileFilter(values.filter);
                              pop();
                            }}
                          />
                        </ActionPanel>
                      }
                    >
                      <Form.TextField id="name" title="Script Name" placeholder="Clean MKV files" defaultValue={scriptName} />
                      <Form.TextField id="desc" title="Description" placeholder="Swap dots, title case, rename as TV show" defaultValue={description} />
                      <Form.TextField
                        id="filter"
                        title="File Filter"
                        placeholder="*.mkv, *.mp4 (empty = all files)"
                        defaultValue={fileFilter}
                        info="Glob pattern. Examples: *.mkv, *.{mkv,mp4}, photo_*"
                      />
                    </Form>,
                  )
                }
              />
              <Action title="Add Step" icon={Icon.Plus} onAction={() => push(<AddStepForm onAdd={addStep} />)} />
              <Action title="Preview on Finder Folder" icon={Icon.Eye} onAction={handlePreview} shortcut={{ modifiers: ["cmd"], key: "p" }} />
              <Action title="Save Script" icon={Icon.SaveDocument} onAction={handleSave} shortcut={{ modifiers: ["cmd"], key: "s" }} />
            </ActionPanel>
          }
        />
      </List.Section>

      <List.Section title={`Pipeline (${steps.length} step${steps.length === 1 ? "" : "s"})`}>
        {steps.length === 0 && (
          <List.Item
            icon={{ source: Icon.Plus, tintColor: Color.SecondaryText }}
            title="No steps yet"
            subtitle="Press Enter to add a step"
            actions={
              <ActionPanel>
                <Action title="Add Step" icon={Icon.Plus} onAction={() => push(<AddStepForm onAdd={addStep} />)} />
              </ActionPanel>
            }
          />
        )}
        {steps.map((step, i) => (
          <List.Item
            key={i}
            icon={{ source: Icon.ChevronRight, tintColor: Color.Blue }}
            title={`Step ${i + 1}: ${stepTypeLabel(step.type)}`}
            subtitle={stepLabel(step)}
            actions={
              <ActionPanel>
                <Action title="Add Step" icon={Icon.Plus} onAction={() => push(<AddStepForm onAdd={addStep} />)} />
                <Action title="Remove Step" icon={Icon.Trash} style={Action.Style.Destructive} onAction={() => removeStep(i)} shortcut={{ modifiers: ["cmd"], key: "backspace" }} />
                <Action title="Move Up" icon={Icon.ArrowUp} onAction={() => moveStepUp(i)} shortcut={{ modifiers: ["cmd"], key: "arrowUp" }} />
                <Action title="Move Down" icon={Icon.ArrowDown} onAction={() => moveStepDown(i)} shortcut={{ modifiers: ["cmd"], key: "arrowDown" }} />
                <Action title="Preview on Finder Folder" icon={Icon.Eye} onAction={handlePreview} shortcut={{ modifiers: ["cmd"], key: "p" }} />
                <Action title="Save Script" icon={Icon.SaveDocument} onAction={handleSave} shortcut={{ modifiers: ["cmd"], key: "s" }} />
              </ActionPanel>
            }
          />
        ))}
      </List.Section>
    </List>
  );
}
