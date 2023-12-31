/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// main.ts
var main_exports = {};
__export(main_exports, {
  default: () => TistoryPosterPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");
var DEFAULT_SETTINGS = {
  accessToken: "",
  blogName: "",
  tags: ""
};
var TistoryPosterPlugin = class extends import_obsidian.Plugin {
  async onload() {
    await this.loadSettings();
    this.addCommand({
      id: "post-editor-note",
      name: "Post the editor note",
      editorCallback: async (editor, view) => {
        const tagModal = new TagModal(
          this.app,
          async (tags) => {
            var _a, _b;
            const el = document.createElement("div");
            await import_obsidian.MarkdownRenderer.renderMarkdown(
              editor.getValue(),
              el,
              (_b = (_a = this.app.workspace.getActiveFile()) == null ? void 0 : _a.path) != null ? _b : "/",
              view
            );
            await postToTistory({
              accessToken: this.settings.accessToken,
              blogName: this.settings.blogName,
              title: view.getDisplayText(),
              content: el.innerHTML,
              tags
            });
          }
        );
        tagModal.open();
      }
    });
    this.addSettingTab(new TistoryPosterSetting(this.app, this));
  }
  onunload() {
  }
  async loadSettings() {
    this.settings = Object.assign(
      {},
      DEFAULT_SETTINGS,
      await this.loadData()
    );
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
};
var TagModal = class extends import_obsidian.Modal {
  constructor(app, onSubmit) {
    super(app);
    this.onSubmit = onSubmit;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.createEl("h1", { text: "Insert tags" });
    new import_obsidian.Setting(contentEl).setName("Tags").addText(
      (text) => text.onChange((value) => {
        this.tags = value;
      })
    );
    new import_obsidian.Setting(contentEl).addButton(
      (btn) => btn.setButtonText("Submit").setCta().onClick(() => {
        this.close();
        this.onSubmit(this.tags);
      })
    );
  }
  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
};
var TistoryPosterSetting = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "Blog" });
    new import_obsidian.Setting(containerEl).setName("Setting Access Token").setDesc(
      "This is a secret token to post an article to tistory blog"
    ).addText(
      (text) => text.setPlaceholder("Enter your secret").setValue(this.plugin.settings.accessToken).onChange(async (value) => {
        this.plugin.settings.accessToken = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Setting Blog Name").setDesc("This is a blog name that you want to post an article ").addText((text) => {
      text.setPlaceholder("Enter your blog name").setValue(this.plugin.settings.blogName).onChange(async (value) => {
        this.plugin.settings.blogName = value;
        await this.plugin.saveSettings();
      });
    });
  }
};
async function postToTistory({
  accessToken,
  blogName,
  title,
  content,
  tags = ""
}) {
  const queries = `access_token=${accessToken}&output=json&blogName=${blogName}&title=${title}&content=${encodeURIComponent(
    content
  )}&visibility=1&category=0&tag=${tags}`;
  const url = `https://www.tistory.com/apis/post/write?${queries}`;
  try {
    await fetch(url, {
      method: "POST"
    });
  } catch (err) {
    console.log("error: ", err);
    throw new Error(err);
  }
}
