package com.ilal

import grails.converters.JSON
import org.springframework.core.io.ResourceLoader
import org.springframework.stereotype.Service

@Service
class UtilityListService {

    final ResourceLoader resourceLoader

    UtilityListService(ResourceLoader resourceLoader) {
        this.resourceLoader = resourceLoader
    }

    List<Map> getUtilityList() {
        try {
            def resourcePath = "file:data/utilities.json"
            def resource = resourceLoader.getResource(resourcePath)
            if (resource.exists()) {
                String jsonText = resource.inputStream.text
                List<Map> utilities = JSON.parse(jsonText) as List<Map>
                if (utilities != null) {
                    log.info("Berhasil memuat ${utilities.size()} utilities dari ${resourcePath}")
                    return utilities
                } else {
                    log.warn("Parsing JSON dari ${resourcePath} menghasilkan null.")
                    return []
                }
            } else {
                log.warn("File json tidak ditemukan")
                return []
            }
        } catch (Exception e) {
            log.error("Gagal memuat json: ${e.message}", e)
            return []
        }
    }
}
