/**
     * @description ControllerForAssessment
     */
public with sharing class ControllerForAssessment {

    @AuraEnabled(cacheable=true)
    /**
     * @description getRelatedListData
     * @param objectApiName
     * @param fieldApiNames
     * @return dataList
     */
    public static List<sObject> getRelatedListData(String objectApiName, String fieldApiNames) {
        String soqlQuery = 'SELECT Id, ' + fieldApiNames + ' FROM ' + objectApiName;
        List<sObject> records = Database.query(soqlQuery);
        // List<Map<String, Object>> dataList = new List<Map<String, Object>>();
        // for (sObject record : records) {
        //     Map<String, Object> dataMap = new Map<String, Object>();
        //     for (String field : fieldApiNames.split(',')) {
        //         dataMap.put(field, record.get(field));
        //     }
        //     dataList.add(dataMap);
        // }
        return records;
    }
}
