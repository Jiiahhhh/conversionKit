<%--
  Created by IntelliJ IDEA.
  User: ilal
  Date: 03/06/25
  Time: 17.46
--%>

<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html lang="id" data-bs-theme="light">
<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title><g:message code="app.title"/></title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
          integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous"/>
    <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet"/>
    <link href="https://cdn.jsdelivr.net/npm/select2-bootstrap-5-theme@1.3.0/dist/select2-bootstrap-5-theme.min.css" rel="stylesheet"/>
    <link rel="preconnect" href="https://fonts.googleapis.com"/>
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/>
    <script src="https://kit.fontawesome.com/339d760b07.js" crossorigin="anonymous"></script>
    <asset:stylesheet src="bin2dec/bin2dec.css"/>
</head>

<body class="bg-body-tertiary">
<div class="container d-flex flex-column align-items-center justify-content-center min-vh-100 py-4">
    <main class="w-100" style="max-width: 720px">
        <div class="card shadow-lg rounded-4">
            <header class="card-header p-3 p-md-4 d-flex justify-content-between align-items-center">
                <h1 class="h3 mb-0"><g:message code="converter.main.title"/></h1>
                <button id="settings-button" title="Pengaturan" class="btn btn-icon btn-outline-secondary">
                    <i class="fa-solid fa-gear"></i>
                </button>
            </header>

            <div class="card-body p-3 p-md-4">
                <div class="row g-3 align-items-end mb-3">
                    <div class="col-md-5">
                        <label for="input-base" class="form-label"><g:message code="converter.label.fromBase"/></label>
                        <select id="input-base" class="form-select select2-init" style="width: 100%">
                            <option value="2"><g:message code="converter.option.format" args="[g.message(code: 'base.name.2'), 2]"/></option>
                            <option value="10" selected><g:message code="converter.option.format" args="[g.message(code: 'base.name.10'), 10]"/></option>
                            <option value="16"><g:message code="converter.option.format" args="[g.message(code: 'base.name.16'), 16]"/></option>
                            <option value="8"><g:message code="converter.option.format" args="[g.message(code: 'base.name.8'), 8]"/></option>
                        </select>
                    </div>

                    <div class="col-md-2 text-center">
                        <button id="swap-bases-button" title="${g.message(code: 'converter.button.swapBases.tooltip')}" class="btn btn-icon btn-outline-secondary">
                            <i class="fa-solid fa-right-left"></i>
                        </button>
                    </div>

                    <div class="col-md-5">
                        <label for="output-base" class="form-label"><g:message code="converter.label.toBase"/></label>
                        <select id="output-base" class="form-select select2-init" style="width: 100%">
                            <option value="2" selected><g:message code="converter.option.format" args="[g.message(code: 'base.name.2'), 2]"/></option>
                            <option value="10"><g:message code="converter.option.format" args="[g.message(code: 'base.name.10'), 10]"/></option>
                            <option value="16"><g:message code="converter.option.format" args="[g.message(code: 'base.name.16'), 16]"/></option>
                            <option value="8"><g:message code="converter.option.format" args="[g.message(code: 'base.name.8'), 8]"/></option>
                        </select>
                    </div>
                </div>

                <div class="mb-3">
                    <label id="input-label" for="input-value" class="form-label"></label>
                    <input type="text" id="input-value" class="form-control form-control-lg" placeholder=""/>
                    <div id="error-message" class="text-danger small mt-1" style="height: 1.2em"></div>
                </div>

                <div class="mb-3">
                    <label id="output-label" for="output-value" class="form-label"></label>
                    <div class="input-group">
                        <input type="text" id="output-value" class="form-control form-control-lg bg-body-secondary"
                                readonly placeholder="${g.message(code: 'converter.placeholder.outputValue')}"/>
                        <button id="copy-output-button" title="${g.message(code: 'converter.button.copyResult.tooltip')}"
                                class="btn btn-outline-secondary">
                            <i class="fa-solid fa-clone"></i>
                        </button>
                    </div>
                </div>
                <div class="d-flex justify-content-end mb-3">
                    <button id="clear-button" class="btn btn-primary"><g:message code="converter.button.clear"/></button>
                </div>
                <div class="accordion" id="extraInfoAccordion">
                    <div class="accordion-item">
                        <h2 class="accordion-header" id="headingSteps">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                    data-bs-target="#collapseSteps" aria-expanded="false" aria-controls="collapseSteps">
                                <g:message code="converter.accordion.steps.title"/>
                            </button>
                        </h2>

                        <div id="collapseSteps" class="accordion-collapse collapse" aria-labelledby="headingSteps"
                             data-bs-parent="#extraInfoAccordion">
                            <div class="accordion-body">
                                <p id="conversion-steps-content" class="small text-body-secondary"
                                   style="white-space: pre-wrap"></p>
                            </div>
                        </div>
                    </div>

                    <div class="accordion-item">
                        <h2 class="accordion-header" id="headingInfo">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                    data-bs-target="#collapseInfo" aria-expanded="false" aria-controls="collapseInfo">
                                <g:message code="converter.accordion.info.title"/>
                            </button>
                        </h2>
                        <div id="collapseInfo" class="accordion-collapse collapse" aria-labelledby="headingInfo"
                                data-bs-parent="#extraInfoAccordion">
                            <div class="accordion-body small text-body-secondary">
                                <p><g:message code="converter.info.binary.description"/></p>
                                <p><g:message code="converter.info.decimal.description"/></p>
                                <p><g:message code="converter.info.hexadecimal.description"/></p>
                                <p><g:message code="converter.info.octal.description"/></p>
                            </div>
                        </div>
                    </div>

                    <div class="accordion-item">
                        <h2 class="accordion-header" id="headingHistory">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                    data-bs-target="#collapseHistory" aria-expanded="false"
                                    aria-controls="collapseHistory">
                                <g:message code="converter.accordion.history.title"/>
                            </button>
                        </h2>
                        <div id="collapseHistory" class="accordion-collapse collapse" aria-labelledby="headingHistory"
                                data-bs-parent="#extraInfoAccordion">
                            <div class="accordion-body">
                                <ul id="history-list" class="list-group list-group-flush small">
                                    <li id="no-history-item" class="list-group-item text-body-secondary"></li>
                                </ul>
                                <button id="clear-history-button" class="btn btn-sm btn-outline-danger mt-2 d-none">
                                    <g:message code="converter.button.clearHistory"/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <footer class="text-center mt-4 mb-3">
            <p class="small text-muted">
                <g:message code="app.footer.text"/>
            </p>
            <div class="mt-2">
                <small><g:message code="app.language.switcher.title"/></small><br>
                <g:link action="${actionName}" params="[lang: 'ind']" class="btn btn-sm btn-outline-secondary mx-1"><g:message code="app.language.indonesia"/></g:link>
                <g:link action="${actionName}" params="[lang: 'en']" class="btn btn-sm btn-outline-secondary mx-1"><g:message code="app.language.english"/></g:link>
            </div>
        </footer>
    </main>
</div>

<div class="modal fade" id="settings-modal" tabindex="-1" aria-labelledby="settingsModalLabel"
     aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="settingsModalLabel"><g:message code="converter.modal.settings.title"/></h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="form-check form-switch mb-3">
                    <input class="form-check-input" type="checkbox" role="switch" id="theme-toggle-checkbox"/>
                    <label class="form-check-label" for="theme-toggle-checkbox"><g:message code="converter.settings.label.darkTheme"/></label>
                </div>
                <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" role="switch" id="grouping-toggle-checkbox"/>
                    <label class="form-check-label" for="grouping-toggle-checkbox"><g:message code="converter.settings.label.groupDigits"/></label>
                </div>
            </div>
        </div>
    </div>
</div>

<script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo="
        crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
        crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
<g:render template="/partial/i18nData"/>
<asset:javascript src="bin2dec/bin2dec.js"/>
</body>
</html>
