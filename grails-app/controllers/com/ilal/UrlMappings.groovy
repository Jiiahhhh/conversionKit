package com.ilal

class UrlMappings {
    static mappings = {
        "/$controller/$action?/$id?(.$format)?"{
            constraints {
                // apply constraints here
            }
        }

        "/"(view:"/index")
        "/bin2dec"(controller: 'biner2Decimal', action: 'index')
        "500"(view:'/error')
        "404"(view:'/notFound')

    }
}
