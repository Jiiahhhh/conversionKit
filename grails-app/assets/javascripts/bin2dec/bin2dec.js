(function ($) {
    var i18n = window.i18nData || {};
    function formatString(str) {
        if (!str) return "";
        for (var i = 1; i < arguments.length; i++) {
            var regexp = new RegExp('\\{' + (i - 1) + '\\}', 'gi');
            str = str.replace(regexp, arguments[i] === undefined ? '' : arguments[i]);
        }
        return str;
    }
    $(function () {
        // --- APPLICATION STATE & SETTINGS ---
        var appState = {
            inputValue: "",
            outputValue: "",
            inputBase: 10,
            outputBase: 2,
            errorMessage: "",
            conversionSteps: i18n.stepsPlaceholder,
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
        var settingsModal = new bootstrap.Modal(document.getElementById("settings-modal")); // Bootstrap modal instance
        var $themeToggleCheckbox = $("#theme-toggle-checkbox");
        var $groupingToggleCheckbox = $("#grouping-toggle-checkbox");

        // --- UTILITY FUNCTIONS ---
        var getBaseName = function (base) {
            var baseKey = String(base);
            if (i18n.baseNames && i18n.baseNames[baseKey]) {
                return i18n.baseNames[baseKey];
            }
            switch (parseInt(base)) {
                case 2: return "Biner";
                case 8: return "Oktal";
                case 10: return "Desimal";
                case 16: return "Heksadesimal";
                default: return "Basis " + base;
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
                case 2: pattern = /^-?[01]+$/; break;
                case 8: pattern = /^-?[0-7]+$/; break;
                case 10: pattern = /^-?\d+$/; break;
                case 16: pattern = /^-?[0-9a-fA-F]+$/; break;
                default: return false;
            }
            return pattern.test(value);
        };

        // --- CONVERSION LOGIC ---
        var convertNumber = function (value, fromBase, toBase) {
            fromBase = parseInt(fromBase);
            toBase = parseInt(toBase);
            value = String(value).trim();
            if (!isValidForBase(value, fromBase)) {
                appState.errorMessage = formatString(i18n.errorInvalidValueFormat || "Nilai ''{0}'' tidak valid untuk {1}.", value, getBaseName(fromBase));
                appState.outputValue = "";
                appState.conversionSteps = formatString(i18n.steps.errorInputInvalid || "Input tidak valid: {0}", value);
                return;
            }
            if (value === "" || value === "-") {
                appState.outputValue = "";
                appState.errorMessage = "";
                appState.conversionSteps = i18n.steps.promptForInput || "Masukkan nilai untuk dikonversi.";
                return;
            }
            try {
                var decimalValue;
                var steps = formatString(i18n.steps.introFormat || "Mengonversi {0} (basis {1}) ke basis {2}:\n\n", value, getBaseName(fromBase), getBaseName(toBase));

                if (fromBase === 10) {
                    decimalValue = BigInt(value);
                    steps += formatString(i18n.steps.inputIsDecimalFormat || "1. Nilai input sudah dalam basis {0}: {1}\n", getBaseName(10), decimalValue);
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
                        appState.errorMessage = formatString(i18n.errorBaseNotSupportedFormat || "Konversi dari basis {0} tidak didukung.", getBaseName(fromBase));
                        return;
                    }
                    if (isNegative) decimalValue = -decimalValue;
                    steps += formatString(i18n.steps.convertToDecimalFormat || "1. Konversi {0} (basis {1}) ke basis {2}:\n", value, getBaseName(fromBase), getBaseName(10));
                    steps += formatString(i18n.steps.eqDecimalFormat || "   = {0} (basis {1})\n", decimalValue, getBaseName(10));
                }
                steps += "\n";
                if (toBase === 10) {
                    appState.outputValue = decimalValue.toString();
                    steps += formatString(i18n.steps.finalResultDecimalFormat || "2. Hasil akhir (basis {0}): {1}", getBaseName(10), appState.outputValue);
                } else {
                    if (decimalValue === BigInt(0)) {
                        appState.outputValue = "0";
                    } else {
                        appState.outputValue = decimalValue.toString(toBase);
                    }
                    steps += formatString(i18n.steps.convertToBaseFormat || "2. Konversi {0} (basis {1}) ke basis {2}:\n", decimalValue, getBaseName(10), getBaseName(toBase));
                    if (decimalValue >= 0) {
                        var num = decimalValue;
                        if (num === BigInt(0))
                            steps += formatString(i18n.steps.divisionFormat || "   {0} / {1} = {2} sisa {3}\n", 0, toBase, 0, 0);
                        var stepDetails = "";
                        while (num > 0) {
                            var remainder = num % BigInt(toBase);
                            var quotient = num / BigInt(toBase);
                            stepDetails = formatString(i18n.steps.divisionFormat || "   {0} / {1} = {2} sisa {3}\n",
                                num, toBase, quotient, parseInt(remainder.toString()).toString(toBase).toUpperCase()) + stepDetails;
                            num = quotient;
                        }
                        steps += stepDetails;
                        steps += formatString(i18n.steps.readRemaindersFormat || "   Baca sisa dari bawah ke atas: {0}\n", appState.outputValue.toUpperCase());
                    } else {
                        steps += (i18n.steps.negativeAbsolute || "   Untuk angka negatif, konversi nilai absolutnya lalu tambahkan tanda '-' di depan.\n");
                        steps += formatString(i18n.steps.absoluteValueFormat || "   |{0}| (basis {1}) = {2} (basis {3})\n",
                            decimalValue, getBaseName(10), (-decimalValue).toString(toBase).toUpperCase(), getBaseName(toBase));
                        steps += formatString(i18n.steps.resultFormat || "   Hasil: {0}\n", appState.outputValue.toUpperCase());
                    }
                }
                appState.errorMessage = "";
                appState.conversionSteps = steps;

                if (appState.outputValue || appState.outputValue === "0") {
                    addToHistory({
                        input: value, fromBase: fromBase, output: appState.outputValue, toBase: toBase, timestamp: new Date().getTime(),
                    });
                }
            } catch (e) {
                console.error("Conversion error:", e);
                appState.errorMessage = i18n.errorConversion || "Terjadi kesalahan saat konversi.";
                appState.outputValue = "";
                appState.conversionSteps = "Error: " + e.message; // Biarkan pesan error dari exception jika spesifik
            }
        };

        // --- UI UPDATE FUNCTIONS ---
        var updateUI = function () {
            $inputLabel.text(formatString(i18n.labels.inputValuePrefix || "Nilai {0}", getBaseName(appState.inputBase)));
            $outputLabel.text(formatString(i18n.labels.outputValuePrefix || "Hasil {0}", getBaseName(appState.outputBase)));
            $inputValueInput.attr("placeholder", formatString(i18n.labels.inputValuePlaceholderPrefix || "Contoh untuk {0}", getBaseName(appState.inputBase)));
            $outputValueInput.val(formatNumber(appState.outputValue, appState.outputBase, appSettings.groupDigits));
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
            convertNumber(appState.inputValue, appState.inputBase, appState.outputBase);
            updateUI();
        };
        var handleBaseChange = function () {
            appState.inputBase = parseInt($inputBaseSelect.val());
            appState.outputBase = parseInt($outputBaseSelect.val());
            convertNumber(appState.inputValue, appState.inputBase, appState.outputBase);
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
            appState.conversionSteps = i18n.stepsPlaceholder || "Langkah-langkah akan muncul di sini setelah konversi berhasil.";
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
                                '<i class="fa-solid fa-check" style="color: #63E6BE;"></i>'
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
            var oldInputValue = appState.inputValue;
            var oldOutputValue = appState.outputValue;
            $inputBaseSelect.val(appState.inputBase).trigger("change.select2");
            $outputBaseSelect.val(appState.outputBase).trigger("change.select2");
            if (oldOutputValue && isValidForBase(oldOutputValue, appState.inputBase)) {
                appState.inputValue = oldOutputValue;
                $inputValueInput.val(oldOutputValue);
            } else if (oldInputValue && isValidForBase(oldInputValue, appState.inputBase)) {
                appState.inputValue = oldInputValue;
                $inputValueInput.val(oldInputValue);
            }
            else {
                appState.inputValue = "";
                $inputValueInput.val("");
            }
            appState.outputValue = "";
            convertNumber(appState.inputValue, appState.inputBase, appState.outputBase);
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
            localStorage.setItem("conversionHistory_bs_jq", JSON.stringify(appState.history));
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
                    .text(i18n.emptyHistory || "Belum ada histori.");
                $historyList.append($noHistoryLi);
                $clearHistoryButton.addClass("d-none");
            } else {
                $.each(appState.history, function (index, item) {
                    var $li = $("<li></li>").addClass(
                        "list-group-item d-flex justify-content-between align-items-center history-item");
                    var $textSpan = $("<span></span>").text(
                        formatNumber(item.input, item.fromBase, false) + " (" +
                        getBaseName(item.fromBase) + ") → " +
                        formatNumber(item.output, item.toBase, appSettings.groupDigits) + " (" +
                        getBaseName(item.toBase) + ")"
                    );
                    var $deleteBtn = $("<button></button>")
                        .html(
                            '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 1rem; height: 1rem;" class="text-danger"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>'
                        )
                        .attr("title", i18n.historyDeleteTooltip || "Hapus item ini")
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
            $outputValueInput.val(formatNumber(appState.outputValue, appState.outputBase, appSettings.groupDigits));
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
            localStorage.setItem("converterSettings_bs_jq", JSON.stringify(appSettings));
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
            $inputBaseSelect.val(appState.inputBase);
            $outputBaseSelect.val(appState.outputBase);

            if ($inputValueInput.val()) {
                handleInputChange();
            } else {
                updateUI();
            }
        };
        initializeApp();
    });
})(jQuery);
