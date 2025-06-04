package com.ilal

class HomeController {

    UtilityListService utilityListService

    def index() {
        List<Map> utilities = utilityListService.getUtilityList()
        [utilities: utilities]
    }
}
