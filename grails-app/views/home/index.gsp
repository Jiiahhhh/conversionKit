<%--
  Created by IntelliJ IDEA.
  User: ilal
  Date: 04/06/25
  Time: 20.45
--%>

<%@ page contentType="text/html;charset=UTF-8" %>
<html>
<head>
    <title><g:message code="app.title"/></title>
    <g:render template="/partial/head"/>
    <asset:stylesheet src="home/home.css"/>
</head>

<body class="d-flex flex-column min-vh-100">
<div class="hero-section">
    <div class="container">
        <h1 class="display-4 mb-3"><g:message code="app.homepage.mainTitle" default="Practical Utility Collection"/></h1>
        <p class="lead"><g:message code="app.homepage.subtitle" default="Discover various tools for your daily needs."/></p>
    </div>
</div>
<main class="container flex-grow-1 mb-5">
    <g:if test="${utilities}">
        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
            <g:each in="${utilities}" var="util">
                <div class="col">
                    <div class="card h-100 utility-card shadow-sm rounded-4">
                        <div class="card-body">
                            <div class="card-icon">
                                <i class="${util.icon}"></i>
                            </div>
                            <h5 class="card-title">
                                <g:message code="${util.nameCode}" default="${util.defaultName}"/>
                            </h5>
                            <p class="card-text">
                                <g:message code="${util.descriptionCode}" default="${util.defaultDesc}"/>
                            </p>
                            <g:if test="${util.linkDetails.controller}">
                                <g:link url="${util.linkDetails.uri}" class="btn btn-primary stretched-link">
                                    <g:message code="app.button.launch" default="Launch App"/>
                                    <i class="fas fa-arrow-right ms-1"></i>
                                </g:link>
                            </g:if>
                            <g:elseif test="${util.linkDetails.uri}">
                                <g:link url="${util.linkDetails.uri}" class="btn btn-primary stretched-link">
                                    <g:message code="app.button.launch" default="Launch App"/>
                                </g:link>
                            </g:elseif>
                            <g:else>
                                <button class="btn btn-secondary stretched-link" disabled>
                                    <g:message code="app.button.unavailable" default="Unavailable"/>
                                </button>
                            </g:else>
                        </div>
                    </div>
                </div>
            </g:each>
        </div>
    </g:if>
    <g:else>
        <div class="alert alert-warning text-center" role="alert">
            <h4 class="alert-heading"><i class="fas fa-exclamation-triangle me-2"></i>
                <g:message code="app.homepage.noUtilities.title" default="Utilities Not Found"/>
            </h4>
            <p>
                <g:message code="app.homepage.noUtilities.message" default="Currently, no utilities are available or an error occurred while loading the utility list."/>
            </p>
            <hr>
            <p class="mb-0"><g:message code="app.homepage.noUtilities.advice" default="Please try again later or contact the administrator if the problem persists."/></p>
        </div>
    </g:else>
</main>
<footer class="footer-custom text-center text-body-secondary mt-auto">
    <div class="container">
        <p>&copy; <g:formatDate date="${new Date()}" format="yyyy"/> <g:message code="app.name" default="Your Converter Kit"/>. <g:message code="app.footer.rights" default="All Rights Reserved."/></p>
        <div class="mt-2">
            <small><g:message code="app.language.switcher.title" default="Select Language:"/></small><br>
            <g:link action="${actionName}" params="[lang: 'ind']" class="btn btn-sm btn-outline-secondary mx-1"><g:message code="app.language.indonesia"/></g:link>
            <g:link action="${actionName}" params="[lang: 'en']" class="btn btn-sm btn-outline-secondary mx-1"><g:message code="app.language.english"/></g:link>
        </div>
    </div>
</footer>

<button id="theme-toggle-btn" class="btn btn-primary rounded-circle p-2 theme-toggle-btn shadow-lg" title="Switch Theme">
    <i class="fas fa-moon" id="theme-icon-moon"></i>
    <i class="fas fa-sun d-none" id="theme-icon-sun"></i>
</button>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
        crossorigin="anonymous"></script>
<asset:javascript src="home/home.js"/>
</body>
</html>