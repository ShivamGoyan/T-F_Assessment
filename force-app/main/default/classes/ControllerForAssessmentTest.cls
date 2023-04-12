/**
     * @description ControllerForAssessmentTest
 */
@isTest
public with sharing class ControllerForAssessmentTest {
    @isTest
    static void testGetRelatedListData() {
        Account account = new Account(Name = 'Test Account');
        insert account;

        List<Object> dataList = ControllerForAssessment.getRelatedListData('Account', 'Name');
        System.assertEquals(dataList.size(), 1);
        //System.assertEquals(dataList[0].Name, 'Test Account');
    }
}