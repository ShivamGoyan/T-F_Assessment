import { createElement } from 'lwc';
import MyLWCComponent from 'c/myLWCComponent';
import getRelatedListData from '@salesforce/apex/ControllerForAssessment.getRelatedListData';

async function flushPromises() {
    return Promise.resolve();
  }
jest.mock(
    '@salesforce/apex/ControllerForAssessment.getRelatedListData',
    () => {
      return {
        default: jest.fn()
      };
    },
    { virtual: true }
  );
describe('c-my-lwc-component', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        jest.clearAllMocks();
    });
    beforeEach(() => {
        const element = createElement("c-my-lwc-component", {
          is: MyLWCComponent
        });
        document.body.appendChild(element);
      });

    it('displays related list data', async() => {
        
        const data = [{ Id: '001', Name: 'Test Record' }];
        getRelatedListData.mockResolvedValue(data);
        
        const element = document.body.querySelector("c-my-lwc-component");
        const h2 = element.shadowRoot.querySelector("h2");
        element.objectApiName = 'Account';
        element.fieldApiNames = 'Name';

        await flushPromises();
        const rows = element.shadowRoot.querySelectorAll('tbody tr');
        expect(h2.textContent).toBe('');
        expect(rows.length).toBe(0);
    });
});