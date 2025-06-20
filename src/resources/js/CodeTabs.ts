import "./CodeTabs.css"

type Snippet = {
    selected?: boolean;
    name: string;
    content: string;
    lang: "js" | "css" | "html";
    file?: string
};

const tabTemplate = (index: number, id: `${string}-${string}-${string}-${string}-${string}`, preElement: HTMLPreElement) => /*html*/`
    <button
        id="${id}-tab-${index}"
        type="button"
        role="tab"
        aria-selected=${index === 0 ? "true" : "false"}
        aria-controls="${id}-tabpanel-${index}"
        aria-current=${index === 0 ? "true" : "false"}
    >
        ${preElement.dataset.language?.toUpperCase()}
    </button>
`

const panelTemplate = (index: number, id: `${string}-${string}-${string}-${string}-${string}`, preElement: HTMLPreElement) => /*html*/`
    <section
        id="${id}-tabpanel-${index}"
        role="tabpanel"
        aria-labelledby="${id}-tab-${index}"
        class="${index !== 0 ? 'is-hidden' : ''}"
    >
        <copy-button></copy-button>
        ${preElement.outerHTML}
    </section>
`

class Tabs extends HTMLElement {
    tabsList = [...this.querySelectorAll("[role=tab]")];
    tabPanels = [...this.querySelectorAll("[role=tabpanel]")];
    preTags = [... this.querySelectorAll('pre')];
    id = globalThis.crypto.randomUUID()

    static init = () =>
        !customElements.get("x-code-tabs") &&
        customElements.define("x-code-tabs", Tabs);

    render() {
        const navTemplate = this.preTags.reduce((str, element, index) => {
            const currentFragment = /*html*/`
                    ${tabTemplate(index, this.id, element)}
                `

            return str += index === this.preTags.length - 1 ? `${currentFragment}</nav>` : currentFragment
        }, /*html*/`
                <nav role="tablist" aria-labelledby="tablist-1">
            `)
        const tabsTempalate = this.preTags.reduce((str, element, index) => {
            const currentFragment = panelTemplate(index,this.id, element )
            return str += currentFragment
        }, "")

        this.innerHTML = navTemplate + tabsTempalate
    }

    constructor() {
        super();

        this.render()

        this.tabsList = [...this.querySelectorAll("[role=tab]")];
        this.tabPanels = [...this.querySelectorAll("[role=tabpanel]")];

        this.tabsList.forEach((tab) => {
            tab.addEventListener("click", () => {
                let tabPanel = document.getElementById(
                    `${tab.getAttribute("aria-controls")}`,
                );
                this.resetActiveTabs();
                this.resetTabIndex(tab as HTMLElement);
                this.togglePanel(tabPanel!);
                tab.setAttribute("aria-selected", "true");
                tab.setAttribute("aria-current", "true");
            });
        });
        this.addEventListener("keydown", (e) => {
            switch (e.key) {
                case "ArrowRight":
                    this.selectRightTab();
                    break;
                case "ArrowLeft":
                    this.selectLeftTab();
                    break;
                case "Home":
                    this.selectFirstTab();
                    break;
                case "End":
                    this.selectLastTab();
                    break;
                default:
                    break;
            }
        });
    }

    togglePanel = (tabPanel: HTMLElement) => {
        this.resetHiddenTabPanels();
        tabPanel.classList.remove("is-hidden");
    };

    resetHiddenTabPanels = () => {
        this.tabPanels.forEach((tabPanel) => {
            if (!tabPanel.classList.contains("is-hidden")) {
                tabPanel.classList.add("is-hidden");
            }
        });
    };

    resetActiveTabs = () => {
        this.tabsList.forEach((tab) => {
            if (tab.getAttribute("aria-selected") === "true") {
                tab.setAttribute("aria-selected", "false");
                tab.setAttribute("aria-current", "false");
            }
        });
    };

    resetTabIndex = (selectedTab: HTMLElement) => {
        this.tabsList.forEach((tab) => {
            tab.setAttribute("tabIndex", "-1");
        });
        selectedTab.removeAttribute("tabIndex");
    };

    getActiveTab = () => {
        let selectedTab;
        this.tabsList.forEach((tab) => {
            if (tab.getAttribute("aria-selected") === "true")
                selectedTab = tab;
        });
        return selectedTab;
    };

    selectRightTab = () => {
        let newTab;
        if (
            this.tabsList.indexOf(this.getActiveTab()!) + 1 ===
            this.tabsList.length
        ) {
            newTab = this.tabsList[0];
        } else {
            newTab =
                this.tabsList[
                this.tabsList.indexOf(this.getActiveTab()!) + 1
                ];
        }
        const oldTab =
            this.tabsList[this.tabsList.indexOf(this.getActiveTab()!)];
        oldTab.setAttribute("aria-selected", "false");
        oldTab.setAttribute("aria-current", "false");
        let tabPanel = document.getElementById(
            `${newTab.getAttribute("aria-controls")}`,
        );
        this.resetActiveTabs();
        this.resetTabIndex(newTab as HTMLElement);
        this.togglePanel(tabPanel!);
        newTab.setAttribute("aria-selected", "true");
        newTab.setAttribute("aria-current", "true");
    };
    selectLeftTab = () => {
        let newTab;
        if (this.tabsList.indexOf(this.getActiveTab()!) - 1 < 0) {
            newTab = this.tabsList[this.tabsList.length - 1];
        } else {
            newTab =
                this.tabsList[
                this.tabsList.indexOf(this.getActiveTab()!) - 1
                ];
        }
        const oldTab =
            this.tabsList[this.tabsList.indexOf(this.getActiveTab()!)];
        oldTab.setAttribute("aria-selected", "false");
        oldTab.setAttribute("aria-current", "false");
        let tabPanel = document.getElementById(
            `${newTab.getAttribute("aria-controls")}`,
        );
        this.resetActiveTabs();
        this.resetTabIndex(newTab as HTMLElement);
        this.togglePanel(tabPanel!);
        newTab.setAttribute("aria-selected", "true");
        newTab.setAttribute("aria-current", "true");
    };

    selectFirstTab = () => {
        const newTab = this.tabsList[0];
        let tabPanel = document.getElementById(
            `${newTab.getAttribute("aria-controls")}`,
        );
        this.resetActiveTabs();
        this.resetTabIndex(newTab as HTMLElement);
        this.togglePanel(tabPanel!);
        newTab.setAttribute("aria-selected", "true");
        newTab.setAttribute("aria-current", "true");
    };

    selectLastTab = () => {
        const newTab = this.tabsList.at(-1)!;
        let tabPanel = document.getElementById(
            `${newTab.getAttribute("aria-controls")}`,
        );
        this.resetActiveTabs();
        this.resetTabIndex(newTab as HTMLElement);
        this.togglePanel(tabPanel!);
        newTab.setAttribute("aria-selected", "true");
        newTab.setAttribute("aria-current", "true");
    };
}

Tabs.init();