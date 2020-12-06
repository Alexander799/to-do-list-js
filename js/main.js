document.addEventListener("DOMContentLoaded", () => {

    const PAGE = document.querySelector('.page'),
        DIV = document.createElement('div'),
        BTNADD = document.querySelector('.page__add'),
        BTNCLEAR = document.querySelector('.page__clear'),
        BTNSAVE = document.querySelector('.page__save'),
        UL = document.querySelector('.page__list'),
        USERINPUT = document.querySelector('.page__input');
    let key = 0;
    /*START "CREATE DECORATION"*/
    perforation();
    restoreSavedData();

    function perforation() {
        const HEIGHTPAGE = getComputedStyle(PAGE); //call all styles properties elements
        const VALUE = parseInt(HEIGHTPAGE.height.replace(/\D+/, '')); //we find and delete all non-numbers
        DIV.classList = 'page__perforation'; //create class for DIV page__perforation
        PAGE.prepend(DIV);
        //added the required number of DIV-element
        //the number 35 in the loop is the step of the elements
        for (let i = 0; i < VALUE / 35; i++) {
            perforationElem();
        }
    }

    function perforationElem() {
        const DIVITEM = document.createElement('div'); //create DIV-element for block page__perforation
        DIVITEM.classList = 'page__perfitem'; //create class for DIV-element page__perfitem
        DIVITEM.style.width = '0.8125em';
        DIVITEM.style.height = '0.8125em';
        DIVITEM.style.marginTop = '1.25em';
        DIVITEM.style.marginLeft = '0.3125em'
        DIVITEM.style.borderRadius = '0.1875em';
        DIVITEM.style.background = '#F3A93B';
        DIV.append(DIVITEM);
    }
    /*END "CREATE DECORATION"*/

    /*START EVENT LISTENERS*/
    //when clicking on the sheet, focus on the input field
    PAGE.addEventListener('click', () => { USERINPUT.focus() });

    //output of a modal window with tips
    PAGE.querySelector('.page__information').addEventListener('click', informWindow);

    //adding an item to the list
    BTNADD.addEventListener('click', inputValidation);
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Enter') {
            inputValidation();
        }
    });

    //deleting a list
    BTNCLEAR.addEventListener('click', clearList);

    //save to local storage
    BTNSAVE.addEventListener('click', addToLocalStorage);
    /*END EVENT LISTENERS*/

    /*VALIDATING USER INPUT*/
    function inputValidation() {
        const INPUT = USERINPUT.value.replace(/\s+/, '');
        if (INPUT.length != 0) {
            list(false, USERINPUT.value, key);
            key++;
        } else {
            alert('Error! Entering an empty line');
            console.error('Entering an empty line');
        }
        USERINPUT.value = '';
    }

    /*INFORM WINDOW*/
    function informWindow() {
        const MODALWINDOW = document.querySelector('.page__infowindow');
        const CLOSEINFO = document.querySelector('.page__infoclose');
        MODALWINDOW.style.display = 'block';
        CLOSEINFO.addEventListener('click', () => {
            MODALWINDOW.style.display = 'none';
        });
    }

    /*LIST BUILDING*/
    function list(status, dataInput, index) {
        const LI = document.createElement('li'),
            CHECKBOX = document.createElement('span'),
            TEXT = document.createElement('span'),
            TRASH = document.createElement('span'),
            CHECKSTATUS = (status) ? `-check-` : `-`;
        LI.classList = `page__litem ${index}`;
        CHECKBOX.classList = `page__licheck ${index}`;
        TEXT.classList = `page__litext ${index}`;
        TRASH.classList = `page__liurn ${index}`;
        UL.append(LI);
        LI.append(CHECKBOX);
        LI.append(TEXT);
        LI.append(TRASH);
        CHECKBOX.innerHTML = `<i class="far fa${CHECKSTATUS}square"></i>`;
        TEXT.innerHTML = dataInput;
        TRASH.innerHTML = `<i class="far fa-trash-alt"></i>`;
        deleteItem(TRASH, LI);
        done(CHECKBOX, TEXT);
    }

    /*TASK STATUS (completed / not completed)*/
    function done(CHECKBOX, TEXT) {
        CHECKBOX.addEventListener('click', () => {
            if ((CHECKBOX.querySelector('.far').getAttribute('class').search('-check-')) !== -1) {
                CHECKBOX.querySelector('i').removeAttribute('class');
                CHECKBOX.querySelector('i').setAttribute('class', 'far fa-square');
                TEXT.style.textDecoration = 'none';
            } else if ((CHECKBOX.querySelector('.far').getAttribute('class').search('-check-')) === -1) {
                CHECKBOX.querySelector('i').removeAttribute('class');
                CHECKBOX.querySelector('i').setAttribute('class', 'far fa-check-square');
                TEXT.style.textDecoration = 'line-through';
            }
        });
    }

    /*REMOVING ONE ITEM FROM THE LIST*/
    function deleteItem(TRASH, LI) {
        TRASH.addEventListener('click', () => {
            LI.remove();
        });
    }

    /*REMOVING ALL ITEMS FROM THE LIST AND LOCAL STORAGE*/
    function clearList() {
        while (UL.firstChild) {
            UL.removeChild(UL.querySelector('li'));
            key = 0;
        }
        localStorage.clear();
    }

    /* SAVE DATA TO THE LOCALSTORAGE */
    function addToLocalStorage() {
        localStorage.clear();
        const LENGTH = document.querySelector('.page__list').childNodes.length;
        if (LENGTH > 0) {
            for (let i = 0; i < LENGTH; i++) {
                let STATUS = document.querySelector('.page__list').childNodes[i].childNodes[0].childNodes[0].classList[1].indexOf('check') != -1,
                    VALUE = document.querySelector('.page__list').childNodes[i].textContent,
                    INDEXKEY = document.querySelector('.page__list').childNodes[i].classList[1],
                    dataArray = { STATUS, VALUE };
                localStorage.setItem(INDEXKEY, JSON.stringify(dataArray));
            }
        } else {
            alert('Error!Trying to save a blank sheet.');
            console.error('Error!Trying to save a blank sheet.');
        }
    }

    /* RESTORE DATA FROM LOCAL STORAGE */
    function restoreSavedData() {
        if (localStorage.length > 0) {
            let keys = Object.keys(localStorage);
            for (let key of keys) {
                list(JSON.parse(localStorage.getItem(key)).STATUS, JSON.parse(localStorage.getItem(key)).VALUE, key);
            }
        }
    }
});