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
    <title>Konverter Sistem Bilangan Lengkap</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
          integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous"/>
    <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet"/>
    <link href="https://cdn.jsdelivr.net/npm/select2-bootstrap-5-theme@1.3.0/dist/select2-bootstrap-5-theme.min.css" rel="stylesheet"/>
    <link rel="preconnect" href="https://fonts.googleapis.com"/>
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/>
    <asset:stylesheet src="bin2dec/bin2dec.css"/>
</head>

<body class="bg-body-tertiary">
<div class="container d-flex flex-column align-items-center justify-content-center min-vh-100 py-4">
    <main class="w-100" style="max-width: 720px">
        <div class="card shadow-lg rounded-4">
            <header class="card-header p-3 p-md-4 d-flex justify-content-between align-items-center">
                <h1 class="h3 mb-0">Konverter Sistem Bilangan</h1>
                <button id="settings-button" title="Pengaturan" class="btn btn-icon btn-outline-secondary rounded-circle">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                         stroke="currentColor" style="width: 1.25rem; height: 1.25rem">
                        <path stroke-linecap="round" stroke-linejoin="round"
                              d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.646.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 1.905c-.007.379.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.333.183-.582.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.759 6.759 0 010-1.905c.007-.379-.137-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                </button>
            </header>

            <div class="card-body p-3 p-md-4">
                <div class="row g-3 align-items-end mb-3">
                    <div class="col-md-5">
                        <label for="input-base" class="form-label">Dari Basis</label>
                        <select id="input-base" class="form-select select2-init" style="width: 100%">
                            <option value="2">Biner (2)</option>
                            <option value="10" selected>Desimal (10)</option>
                            <option value="16">Heksadesimal (16)</option>
                            <option value="8">Oktal (8)</option>
                        </select>
                    </div>

                    <div class="col-md-2 text-center">
                        <button id="swap-bases-button" title="Tukar Basis" class="btn btn-icon btn-outline-secondary rounded-circle">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                 stroke="currentColor" style="width: 1.25rem; height: 1.25rem">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                      d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h18m-7.5-14L21 6.5m0 0L16.5 11M21 6.5H3"/>
                            </svg>
                        </button>
                    </div>

                    <div class="col-md-5">
                        <label for="output-base" class="form-label">Ke Basis</label>
                        <select id="output-base" class="form-select select2-init" style="width: 100%">
                            <option value="2" selected>Biner (2)</option>
                            <option value="10">Desimal (10)</option>
                            <option value="16">Heksadesimal (16)</option>
                            <option value="8">Oktal (8)</option>
                        </select>
                    </div>
                </div>

                <div class="mb-3">
                    <label id="input-label" for="input-value" class="form-label">Nilai Desimal</label>
                    <input type="text" id="input-value" class="form-control form-control-lg" placeholder="Contoh: 123"/>
                    <div id="error-message" class="text-danger small mt-1" style="height: 1.2em"></div>
                </div>

                <div class="mb-3">
                    <label id="output-label" for="output-value" class="form-label">Hasil Biner</label>
                    <div class="input-group">
                        <input type="text" id="output-value" class="form-control form-control-lg bg-body-secondary"
                                readonly placeholder="Hasil akan muncul di sini"/>
                        <button id="copy-output-button" title="Salin Hasil" class="btn btn-outline-secondary">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                 stroke="currentColor" style="width: 1.25rem; height: 1.25rem">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 4.625v2.625a2.625 2.625 0 11-5.25 0v-2.625m0 0V11.25m0 0H7.5m9 0H18a2.625 2.625 0 002.625-2.625v-1.5A2.625 2.625 0 0018 4.5H7.5m0 0v1.5c0 .621.504 1.125 1.125 1.125H15"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="d-flex justify-content-end mb-3">
                    <button id="clear-button" class="btn btn-primary">Bersihkan</button>
                </div>
                <div class="accordion" id="extraInfoAccordion">
                    <div class="accordion-item">
                        <h2 class="accordion-header" id="headingSteps">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                    data-bs-target="#collapseSteps" aria-expanded="false" aria-controls="collapseSteps">
                                Langkah-langkah Konversi
                            </button>
                        </h2>

                        <div id="collapseSteps" class="accordion-collapse collapse" aria-labelledby="headingSteps"
                             data-bs-parent="#extraInfoAccordion">
                            <div class="accordion-body">
                                <p id="conversion-steps-content" class="small text-body-secondary" style="white-space: pre-wrap">
                                    Langkah-langkah akan muncul di sini setelah konversi
                                    berhasil.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="accordion-item">
                        <h2 class="accordion-header" id="headingInfo">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                    data-bs-target="#collapseInfo" aria-expanded="false" aria-controls="collapseInfo">
                                Info Sistem Bilangan
                            </button>
                        </h2>

                        <div id="collapseInfo" class="accordion-collapse collapse" aria-labelledby="headingInfo"
                                data-bs-parent="#extraInfoAccordion">
                            <div class="accordion-body small text-body-secondary">
                                <p><strong>Biner (Basis 2):</strong>
                                    Menggunakan digit 0 dan 1. Dasar dari komputasi digital.</p>
                                <p><strong>Desimal (Basis 10):</strong>
                                    Sistem bilangan yang kita gunakan sehari-hari, digit 0-9.</p>
                                <p><strong>Heksadesimal (Basis 16):</strong> Menggunakan digit 0-9 dan huruf A-F
                                    (A=10, B=11, ..., F=15). Sering digunakan dalam pemrograman untuk representasi
                                    memori dan warna.</p>
                                <p><strong>Oktal (Basis 8):</strong> Menggunakan digit 0-7. Dulu lebih umum, sekarang
                                    kurang populer dibandingkan heksadesimal.</p>
                            </div>
                        </div>
                    </div>

                    <div class="accordion-item">
                        <h2 class="accordion-header" id="headingHistory">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                    data-bs-target="#collapseHistory" aria-expanded="false"
                                    aria-controls="collapseHistory">
                                Histori Konversi (Sesi Ini)
                            </button>
                        </h2>
                        <div id="collapseHistory" class="accordion-collapse collapse" aria-labelledby="headingHistory"
                                data-bs-parent="#extraInfoAccordion">
                            <div class="accordion-body">
                                <ul id="history-list" class="list-group list-group-flush small">
                                    <li id="no-history-item" class="list-group-item text-body-secondary">
                                        Belum ada histori.
                                    </li>
                                </ul>
                                <button id="clear-history-button" class="btn btn-sm btn-outline-danger mt-2 d-none">
                                    Bersihkan Histori
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <footer class="text-center mt-4 mb-3">
            <p class="small text-muted">
                Konverter Sistem Bilangan Lengkap v2.2 (jQuery Pattern)
            </p>
        </footer>
    </main>
</div>

<div class="modal fade" id="settings-modal-bootstrap" tabindex="-1" aria-labelledby="settingsModalLabel"
     aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="settingsModalLabel">Pengaturan</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="form-check form-switch mb-3">
                    <input class="form-check-input" type="checkbox" role="switch" id="theme-toggle-checkbox"/>
                    <label class="form-check-label" for="theme-toggle-checkbox">Tema Gelap</label>
                </div>
                <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" role="switch" id="grouping-toggle-checkbox"/>
                    <label class="form-check-label" for="grouping-toggle-checkbox">Kelompokkan Digit Hasil</label>
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

<asset:javascript src="bin2dec/bin2dec.js"/>
</body>
</html>
