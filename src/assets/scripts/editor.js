let codeInput = null;
var auto = true;

getMarkdown = null;
replaceAtCaret = null;

// Mostly Editor Functions
(function() {
    if (typeof(Storage) === "undefined") {
        alert("Your browser does not support saving. Please use the latest version of Google Chrome, Edge, Firefox, Safari, or Opera.");
    }

    auto = (window.localStorage.autoStored == "true");

    function updatePreview() {
        let iframe = document.getElementById("out");
        let currentPreview = iframe.src.substring(iframe.src.lastIndexOf("/") + 1);
        if (currentPreview == "preview") {
            iframe.src = "/create/output/#/preview2";
        } else {
            document.getElementById("out").src = "/create/output/#/preview";
        }
    }

    function applyAutoStates() {
        if (auto) {
            $("#auto").addClass("green-b");
            $("#preview-btn").text("Auto Preview");
            document.getElementById("preview-btn").disabled = true;
            updatePreview();
        } else {
            $("#auto").removeClass("green-b");
            $("#preview-btn").text("Preview Changes");
            document.getElementById("preview-btn").disabled = false;
        }
    }

    function toggleAutoState() {
        auto = !auto;
        window.localStorage.autoStored = auto;
        applyAutoStates();
    }

    replaceAtCaret = function(str) {
        codeInput.replaceSelection(str);
        codeInput.focus();
    }

    getMarkdown = function() {
        return codeInput.getValue();
    }

    var defaultCode = "";

    if (window.localStorage.savedWrite) {
        defaultCode = window.localStorage.savedWrite;
    } else {
        defaultCode = "*BigBrain Team @5.3.20* \n" +
            "# Welcome to the Editor!\n" +
            "## About\n" +
            "- We use [markdown](https://www.markdownguide.org/basic-syntax/) to generate courses.\n" +
            "- This allows for great customizability and it's easy to learn!\n" +
            "- Your work will be saved on this computer. :computer:\n" +
            "- More features to aid your lesson creation comming soon...\n\n\n";
    }

    // Init Code Editor
    codeInput = CodeMirror(document.getElementById("in"), {
        value: defaultCode,
        theme: "material-palenight",
        mode: "gfm",
        lineNumbers: true
    });
    codeInput.focus();
    codeInput.setCursor(codeInput.lineCount());

    // Init Math Field
    MathLive.	makeMathField("mathfield", {
        virtualKeyboardMode: 'manual'
    });

    // Reload Button
    document.getElementById("preview-btn")
        .addEventListener("click", updatePreview);

    // Headings Button
    for (let i = "i"; i != "iiiii"; i += "i") {
        document.getElementById(i + "-heading")
            .addEventListener("click", function() {
                let text = `\n${"#".repeat(i.length)} Heading\n`;
                replaceAtCaret(text);
            });
    }

    // Tabs button
    document.getElementById("tabs")
        .addEventListener("click", function() {
            let text = "\n<!-- tabs:start -->\n\n#### **Tab 1**\n\n#### **Tab 2**\n\n<!-- tabs:end -->\n";
            replaceAtCaret(text);
        });

    // Inline Equation Button
    document.getElementById("eq")
        .addEventListener("click", function() {
            let text = document.getElementById("mathfield").mathfield.$text();
            text = text.replace("\\mright", "\\right").replace("\\mleft", "\\left");
            replaceAtCaret(`$${text}$`);
        });

    // Block Equation Button
    document.getElementById("eq-block")
        .addEventListener("click", function() {
            let text = document.getElementById("mathfield").mathfield.$text();
            text = text.replace("\\mright", "\\right").replace("\\mleft", "\\left");
            replaceAtCaret(`\n$$${text}$$\n`);
        });


    // Alert Button
    document.getElementById("alert-btn")
        .addEventListener("click", function() {
            let text = "\n!> Alert! :100:\n";
            replaceAtCaret(text);
        });

    // Callout Button
    document.getElementById("callout-btn")
        .addEventListener("click", function() {
            let text = "\n?> Callout. :smirk:\n";
            replaceAtCaret(text);
        });

    // Code Button
    document.getElementById("code-btn")
        .addEventListener("click", function() {
            let text = "\n```java\nSystem.out.println(\"Hello World\");\n```\n";
            replaceAtCaret(text);
        });

    // Flip View Button
    document.getElementById("flip")
        .addEventListener("click", function() {
            $("#creator > .cards-container").toggleClass("stacked");
        });

    document.getElementById("bold-btn")
        .addEventListener("click", function() {
            let text = codeInput.getSelection();
            if (text.substring(0, 2) + text.substring(text.length - 2) == "****") {
                codeInput.replaceSelection(text.substring(2, text.length - 2))
            } else {
                codeInput.replaceSelection(`**${text}**`);
            }

            codeInput.focus();
        });

    document.getElementById("italic-btn")
        .addEventListener("click", function() {
            let text = codeInput.getSelection();
            if (text.substring(0, 1) + text.substring(text.length - 1) == "**" &&
                text.substring(0, 2) + text.substring(text.length - 2) != "****" ||
                text.substring(0, 3) + text.substring(text.length - 3) == "******") {
                codeInput.replaceSelection(text.substring(1, text.length - 1));
            } else {
                codeInput.replaceSelection(`*${text}*`);
            }

            codeInput.focus();
        });

    document.getElementById("link-btn")
        .addEventListener("click", function() {
            if (codeInput.getSelection().length != 0) {
                replaceAtCaret(`[${codeInput.getSelection()}](url)`);
            } else {
                replaceAtCaret("[text](url)");
            }

        });

    document.getElementById("auto")
        .addEventListener("click", function() {
            toggleAutoState();
        });

    // Hide button
    document.getElementById("hider")
        .addEventListener("click", function() {
            $(".btn-row").stop(true, false).slideToggle(500, "easeInOutExpo");
            $("#hider").toggleClass("red");
        });

    // Auto Updating Parsing
    codeInput.on("change", function() {
        window.localStorage.savedWrite = getMarkdown();
        if (auto) {
            updatePreview();
        };
    });

    // CTRL + S to reload
    $(window).bind('keydown', function(event) {
        if (event.ctrlKey || event.metaKey) {
            if (String.fromCharCode(event.which).toLowerCase() == 's') {
                event.preventDefault();
                updatePreview();
            }
        }
    });

    // Post Init
    applyAutoStates();
    $(".ML__virtual-keyboard-toggle").attr("data-tooltip", "Keyboard");
})();

var getSidebarMarkdown = null;

// Mostly Builder Functions
(function() {
    function updatePreview() {
        let iframe = document.getElementById("out-s");
        let currentPreview = iframe.src.substring(iframe.src.lastIndexOf("/") + 1);
        if (currentPreview == "preview") {
            iframe.src = "/create/output-sidebar/#/preview2";
        } else {
            document.getElementById("out-s").src = "/create/output-sidebar/#/preview";
        }
    }

	$("#builder").find("input").on("keyup", updatePreview);

    const list = document.getElementById("sidebar-flow");
    const list2 = document.getElementById("sidebar-catalog")

    new Sortable(list, {
        group: "main",
        handle: ".grip",
        animation: 150,
        fallbackOnBody: true,
        removeCloneOnHide: true,
        onChange: function(e) {
            updatePreview();
        }
    });

    new Sortable(list2, {
        group: {
            name: "main",
            pull: "clone",
            put: false,
        },
        sort: false,
        handle: ".grip",
        animation: 150,
        fallbackOnBody: true,
        onEnd: function(e) {
            updatePreview();
        }
    });

    $("item > i.red").click(function() {
        $(this).parent().slideToggle(100, function() {
            $(this).remove();
            updatePreview();
        });
    });

	// Gets tree of values
    function grabHeadings() {
    	let items = [];

    	$("#sidebar-flow").children().each(function() {
    		const txt = $(this).find("input").val()
    		const placeholder = $(this).find("input").attr("placeholder");

    		if (txt) {
    			items.push([txt, placeholder]);
    		} else {
    			items.push([placeholder, placeholder]);
    		}
    	});

    	return items;
    }

    getSidebarMarkdown = function() {
		const list = grabHeadings();
		
		let markdown = "";
		let courseTitle = "";
		let startedDetails = false;
		let startedHeadings = false;
		let empty = true;

		list.forEach(item => {
			if (item[1] == "Course Title") {
				// Just change title
				courseTitle = item[0];

			} else if (item[1] == "Lesson") {
				// Lessons (last)
				if (startedHeadings) markdown += "\t";
				if (startedDetails) markdown += "\t";
				markdown += `* [${item[0]}](#Sidebar-Preview)\n`;
				empty = false;
				
			} else if (item[1] == "Heading") {
				// Headings (top)
				if (startedDetails) {
					if (!empty) markdown += "\n";
                    if (startedHeadings) markdown += "\t";
                    markdown += "</details>\n\n";
                }
				startedDetails = false;
				startedHeadings = true;

				// If there is a traling space, delete it.
				markdown += `* **${(item[0].substr(-1) == " ") ? item[0].slice(0, -1) : item[0]}**\n`;

				
			} else if (item[1] == "Toggle") {
				if (startedDetails) {
					if (!empty) markdown += "\n";
                    if (startedHeadings) markdown += "\t";
                    markdown += "</details>\n\n";
                }
				if (startedHeadings) markdown += "\t";
				markdown += "* <details>\n";

                if (startedHeadings) markdown += "\t";
				markdown += `\t<summary>${item[0]}</summary>\n\n`;

				startedDetails = true;
                empty = true;
			}
		});

		if (startedDetails) {
			if (!empty) markdown += "\n";
            if (startedHeadings) markdown += "\t";
            markdown += "</details>\n\n";
        }
		
		return markdown;
    }
    
})();
