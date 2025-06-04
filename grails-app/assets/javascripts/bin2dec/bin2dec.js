(function ($) {
    $(function () {
        // --- APPLICATION STATE & SETTINGS ---
        var appState = {
            inputValue: "",
            outputValue: "",
            inputBase: 10,
            outputBase: 2,
            errorMessage: "",
            conversionSteps:
                "Langkah-langkah akan muncul di sini setelah konversi berhasil.",
            history: [],
        };

        var appSettings = {
            isDarkMode: false,
            groupDigits: false,
        };

        // --- CACHED JQUERY DOM ELEMENTS ---
        var $html = $("html");
        var $inputBaseSelect = $("#input-base");
        var $outputBaseSelect = $("#output-base");
        var $inputValueInput = $("#input-value");
        var $outputValueInput = $("#output-value");
        var $inputLabel = $("#input-label");
        var $outputLabel = $("#output-label");
        var $errorMessageP = $("#error-message");
        var $copyOutputButton = $("#copy-output-button");
        var $clearButton = $("#clear-button");
        var $swapBasesButton = $("#swap-bases-button");
        var $conversionStepsContent = $("#conversion-steps-content");
        var $historyList = $("#history-list");
        var $clearHistoryButton = $("#clear-history-button");
        var $settingsButton = $("#settings-button");
        var settingsModal = new bootstrap.Modal(
            document.getElementById("settings-modal-bootstrap")
        ); // Bootstrap modal instance
        var $themeToggleCheckbox = $("#theme-toggle-checkbox");
        var $groupingToggleCheckbox = $("#grouping-toggle-checkbox");

        // --- UTILITY FUNCTIONS ---
        var getBaseName = function (base) {
            switch (parseInt(base)) {
                case 2:
                    return "Biner";
                case 8:
                    return "Oktal";
                case 10:
                    return "Desimal";
                case 16:
                    return "Heksadesimal";
                default:
                    return "Basis " + base;
            }
        };

        var formatNumber = function (numberStr, base, group) {
            if (!numberStr) return "";
            var originalCaseValue = String(numberStr);
            if (!group) return originalCaseValue.toUpperCase();

            base = parseInt(base);
            numberStr = String(numberStr).toUpperCase();

            if (base === 2) return numberStr.replace(/\B(?=(\d{4})+(?!\d))/g, " ");
            if (base === 10) {
                var parts = numberStr.split(".");
                parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                return parts.join(",");
            }
            if (base === 16) return numberStr.replace(/\B(?=(\d{4})+(?!\d))/g, " ");
            return numberStr;
        };

        var isValidForBase = function (value, base) {
            if (value === "" || value === "-") return true;
            base = parseInt(base);
            var pattern;
            switch (base) {
                case 2:
                    pattern = /^-?[01]+$/;
                    break;
                case 8:
                    pattern = /^-?[0-7]+$/;
                    break;
                case 10:
                    pattern = /^-?\d+$/;
                    break;
                case 16:
                    pattern = /^-?[0-9a-fA-F]+$/;
                    break;
                default:
                    return false;
            }
            return pattern.test(value);
        };

        // --- CONVERSION LOGIC ---
        var convertNumber = function (value, fromBase, toBase) {
            fromBase = parseInt(fromBase);
            toBase = parseInt(toBase);
            value = String(value).trim();

            if (!isValidForBase(value, fromBase)) {
                appState.errorMessage =
                    "Nilai tidak valid untuk " + getBaseName(fromBase) + ".";
                appState.outputValue = "";
                appState.conversionSteps = "Input tidak valid.";
                return;
            }

            if (value === "" || value === "-") {
                appState.outputValue = "";
                appState.errorMessage = "";
                appState.conversionSteps = "Masukkan nilai untuk dikonversi.";
                return;
            }

            try {
                var decimalValue;
                var steps =
                    "Mengonversi " +
                    value +
                    " (basis " +
                    fromBase +
                    ") ke basis " +
                    toBase +
                    ":\n\n";

                if (fromBase === 10) {
                    decimalValue = BigInt(value);
                    steps +=
                        "1. Nilai input sudah dalam basis 10: " + decimalValue + "\n";
                } else {
                    var tempValue = value;
                    var isNegative = false;
                    if (value.startsWith("-")) {
                        isNegative = true;
                        tempValue = value.substring(1);
                    }

                    if (fromBase === 16) decimalValue = BigInt("0x" + tempValue);
                    else if (fromBase === 8) decimalValue = BigInt("0o" + tempValue);
                    else if (fromBase === 2) decimalValue = BigInt("0b" + tempValue);
                    else {
                        appState.errorMessage =
                            "Konversi dari basis " +
                            fromBase +
                            " tidak didukung secara langsung.";
                        return;
                    }

                    if (isNegative) decimalValue = -decimalValue;
                    steps +=
                        "1. Konversi " + value + " (basis " + fromBase + ") ke basis 10:\n";
                    steps += "   = " + decimalValue + " (basis 10)\n";
                }
                steps += "\n";

                if (toBase === 10) {
                    appState.outputValue = decimalValue.toString();
                    steps += "2. Hasil akhir (basis 10): " + appState.outputValue;
                } else {
                    if (decimalValue === BigInt(0)) {
                        appState.outputValue = "0";
                    } else {
                        appState.outputValue = decimalValue.toString(toBase);
                    }
                    steps +=
                        "2. Konversi " +
                        decimalValue +
                        " (basis 10) ke basis " +
                        toBase +
                        ":\n";
                    if (decimalValue >= 0) {
                        var num = decimalValue;
                        if (num === BigInt(0))
                            steps += "   0 / " + toBase + " = 0 sisa 0\n";
                        var stepDetails = "";
                        while (num > 0) {
                            var remainder = num % BigInt(toBase);
                            stepDetails =
                                "   " +
                                num +
                                " / " +
                                toBase +
                                " = " +
                                num / BigInt(toBase) +
                                " sisa " +
                                parseInt(remainder.toString()).toString(toBase).toUpperCase() +
                                "\n" +
                                stepDetails;
                            num /= BigInt(toBase);
                        }
                        steps += stepDetails;
                        steps +=
                            "   Baca sisa dari bawah ke atas: " +
                            appState.outputValue.toUpperCase() +
                            "\n";
                    } else {
                        steps +=
                            "   Untuk angka negatif, konversi nilai absolutnya lalu tambahkan tanda '-' di depan.\n";
                        steps +=
                            "   |" +
                            decimalValue +
                            "| (" +
                            getBaseName(10) +
                            ") = " +
                            (-decimalValue).toString(toBase).toUpperCase() +
                            " (" +
                            getBaseName(toBase) +
                            ")\n";
                        steps += "   Hasil: " + appState.outputValue.toUpperCase() + "\n";
                    }
                }
                appState.errorMessage = "";
                appState.conversionSteps = steps;

                if (appState.outputValue || appState.outputValue === "0") {
                    addToHistory({
                        input: value,
                        fromBase: fromBase,
                        output: appState.outputValue,
                        toBase: toBase,
                        timestamp: new Date().getTime(),
                    });
                }
            } catch (e) {
                console.error("Conversion error:", e);
                appState.errorMessage = "Terjadi kesalahan saat konversi.";
                appState.outputValue = "";
                appState.conversionSteps = "Error: " + e.message;
            }
        };

        // --- UI UPDATE FUNCTIONS ---
        var updateUI = function () {
            $inputLabel.text("Nilai " + getBaseName(appState.inputBase));
            $outputLabel.text("Hasil " + getBaseName(appState.outputBase));
            $inputValueInput.attr(
                "placeholder",
                "Contoh untuk " + getBaseName(appState.inputBase)
            );

            $outputValueInput.val(
                formatNumber(
                    appState.outputValue,
                    appState.outputBase,
                    appSettings.groupDigits
                )
            );

            $errorMessageP.text(appState.errorMessage);
            if (appState.errorMessage) {
                $inputValueInput.addClass("error");
            } else {
                $inputValueInput.removeClass("error");
            }

            $conversionStepsContent.text(appState.conversionSteps);
            renderHistory();
        };

        // --- EVENT HANDLERS ---
        var handleInputChange = function () {
            appState.inputValue = $inputValueInput.val();
            convertNumber(
                appState.inputValue,
                appState.inputBase,
                appState.outputBase
            );
            updateUI();
        };

        var handleBaseChange = function () {
            appState.inputBase = parseInt($inputBaseSelect.val());
            appState.outputBase = parseInt($outputBaseSelect.val());
            convertNumber(
                appState.inputValue,
                appState.inputBase,
                appState.outputBase
            );
            updateUI();
        };

        // Initialize Select2
        $(".select2-init").select2({ theme: "bootstrap-5" });
        $inputBaseSelect.on("change", handleBaseChange);
        $outputBaseSelect.on("change", handleBaseChange);

        $inputValueInput.on("input", handleInputChange);

        $clearButton.on("click", function () {
            appState.inputValue = "";
            appState.outputValue = "";
            appState.errorMessage = "";
            appState.conversionSteps =
                "Langkah-langkah akan muncul di sini setelah konversi berhasil.";
            $inputValueInput.val("");
            updateUI();
        });

        $copyOutputButton.on("click", function () {
            var valueToCopy = appState.outputValue;
            if (valueToCopy || valueToCopy === "0") {
                navigator.clipboard
                    .writeText(valueToCopy.toUpperCase())
                    .then(
                        function () {
                            var $button = $(this);
                            var originalIcon = $button.html();
                            $button.html(
                                '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="green" style="width: 1.25rem; height: 1.25rem;"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>'
                            );
                            setTimeout(function () {
                                $button.html(originalIcon);
                            }, 1500);
                        }.bind(this)
                    ) // Bind 'this' to the button
                    .catch(function (err) {
                        console.error("Gagal menyalin: ", err);
                    });
            }
        });

        $swapBasesButton.on("click", function () {
            var tempBase = appState.inputBase;
            appState.inputBase = appState.outputBase;
            appState.outputBase = tempBase;

            $inputBaseSelect.val(appState.inputBase).trigger("change.select2");
            $outputBaseSelect.val(appState.outputBase).trigger("change.select2");

            var currentOutput = appState.outputValue;
            if (currentOutput && isValidForBase(currentOutput, appState.inputBase)) {
                appState.inputValue = currentOutput;
                $inputValueInput.val(currentOutput);
            } else if (currentOutput) {
                appState.inputValue = "";
                $inputValueInput.val("");
            }
            convertNumber(
                appState.inputValue,
                appState.inputBase,
                appState.outputBase
            );
            updateUI();
        });

        // --- HISTORY MANAGEMENT ---
        var loadHistory = function () {
            var storedHistory = localStorage.getItem("conversionHistory_bs_jq");
            if (storedHistory) {
                appState.history = JSON.parse(storedHistory);
            }
        };

        var saveHistory = function () {
            localStorage.setItem(
                "conversionHistory_bs_jq",
                JSON.stringify(appState.history)
            );
        };

        var addToHistory = function (item) {
            appState.history.unshift(item);
            if (appState.history.length > 10) {
                appState.history.pop();
            }
            saveHistory();
        };

        var renderHistory = function () {
            $historyList.empty();
            if (appState.history.length === 0) {
                var $noHistoryLi = $("<li></li>")
                    .attr("id", "no-history-item")
                    .addClass("list-group-item text-body-secondary")
                    .text("Belum ada histori.");
                $historyList.append($noHistoryLi);
                $clearHistoryButton.addClass("d-none");
            } else {
                $.each(appState.history, function (index, item) {
                    var $li = $("<li></li>").addClass(
                        "list-group-item d-flex justify-content-between align-items-center history-item"
                    );

                    var $textSpan = $("<span></span>").text(
                        formatNumber(item.input, item.fromBase, false) +
                        " (" +
                        getBaseName(item.fromBase) +
                        ") → " +
                        formatNumber(item.output, item.toBase, appSettings.groupDigits) +
                        " (" +
                        getBaseName(item.toBase) +
                        ")"
                    );

                    var $deleteBtn = $("<button></button>")
                        .html(
                            '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 1rem; height: 1rem;" class="text-danger"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>'
                        )
                        .attr("title", "Hapus item ini")
                        .addClass("btn btn-sm btn-icon delete-history-btn opacity-0")
                        .on("click", function () {
                            appState.history.splice(index, 1);
                            saveHistory();
                            renderHistory();
                        });

                    $li.append($textSpan).append($deleteBtn);
                    $historyList.append($li);
                });
                $clearHistoryButton.removeClass("d-none");
            }
        };

        $clearHistoryButton.on("click", function () {
            appState.history = [];
            saveHistory();
            renderHistory();
        });

        // --- SETTINGS MODAL ---
        $settingsButton.on("click", function () {
            settingsModal.show();
        });

        // --- THEME & SETTINGS LOGIC ---
        var applySettings = function () {
            $html.attr("data-bs-theme", appSettings.isDarkMode ? "dark" : "light");
            $themeToggleCheckbox.prop("checked", appSettings.isDarkMode);
            $groupingToggleCheckbox.prop("checked", appSettings.groupDigits);

            $outputValueInput.val(
                formatNumber(
                    appState.outputValue,
                    appState.outputBase,
                    appSettings.groupDigits
                )
            );
            renderHistory();
        };

        var loadSettings = function () {
            var storedSettings = localStorage.getItem("converterSettings_bs_jq");
            if (storedSettings) {
                appSettings = JSON.parse(storedSettings);
            } else {
                appSettings.isDarkMode =
                    window.matchMedia &&
                    window.matchMedia("(prefers-color-scheme: dark)").matches;
            }
            applySettings();
        };

        var saveSettings = function () {
            localStorage.setItem(
                "converterSettings_bs_jq",
                JSON.stringify(appSettings)
            );
        };

        $themeToggleCheckbox.on("change", function () {
            appSettings.isDarkMode = $(this).is(":checked");
            saveSettings();
            applySettings();
        });

        $groupingToggleCheckbox.on("change", function () {
            appSettings.groupDigits = $(this).is(":checked");
            saveSettings();
            applySettings();
        });

        // --- INITIALIZATION ---
        var initializeApp = function () {
            loadSettings();
            loadHistory();

            $inputBaseSelect.val(appState.inputBase).trigger("change");
            $outputBaseSelect.val(appState.outputBase).trigger("change");
            updateUI();
        };

        initializeApp();
    });
})(jQuery);
