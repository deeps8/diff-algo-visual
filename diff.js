
// lcs algo.
function findDiff(t1Arr,t2Arr){
    let outputEl = document.getElementById('output');
    outputEl.innerHTML = "";

    let n = t1Arr.length+1, m = t2Arr.length+1;
    var deff = new Array(n).fill(0),len = new Array(n).fill(0);
    let i=0,j=0;
    for (i = 0; i <=n; i++) {
        deff[i] = new Array(m).fill(0);
        len[i] = new Array(m).fill(0);
    }

    for ( i = 0; i <= n; i++) {
        for ( j = 0; j <= m; j++) {
            if(i==0 || j==0){
                len[i][j] = 0;
                deff[i][j] = 'E'; // empty 
            }   
            else if(t1Arr[i-1] == t2Arr[j-1]){
                len[i][j] = len[i-1][j-1] + 1;
                deff[i][j] = 'D'; // digonal : common text
            }
            else {
                if(len[i-1][j]>=len[i][j-1]){
                    len[i][j] = len[i-1][j];
                    deff[i][j] = 'L'; // left : delete old text
                }
                else{
                    len[i][j] = len[i][j-1];
                    deff[i][j] = 'U'; // up : add new text
                }
            }
        }
    }


    // now reversing back from bottom to up with delete and add words/chars.
    console.log(len[i-1][j-1],i,j);
    var ans = [];
    i = n-1;
    j=m-1;
    while (i>0 && j>0) {
        if(deff[i][j]=='D'){
            outputEl.innerHTML = ` ${t1Arr[i-1]} ` + outputEl.innerHTML;
            ans.push(''+t1Arr[i-1]);
            i--;
            j--;
        }
        else if(deff[i][j]=='U'){
            outputEl.innerHTML = ` <span class="add">${t2Arr[j-1]}</span> ` + outputEl.innerHTML;
            ans.push('+ '+t2Arr[j-1]);
            j--;
        }
        else if(deff[i][j]=='L'){
            outputEl.innerHTML = ` <span class="del">${t1Arr[i-1]}</span> ` + outputEl.innerHTML;
            ans.push('- '+t1Arr[i-1]);
            i--;
        }
        else if(deff[i][j]=='E'){
            if(i==0){
                outputEl.innerHTML = ` <span class="add">${t2Arr[j-1]}</span> ` + outputEl.innerHTML;
                ans.push('+ '+t2Arr[j-1]);
                j--; 
            }
            else if(j==0){
                outputEl.innerHTML = ` <span class="del">${t1Arr[i-1]}</span> ` + outputEl.innerHTML;
                ans.push('- '+t1Arr[i-1]);
                i--;
            }
        }
    }

    ans = ans.reverse();
    console.log(ans);
}


function changeType(type){
    console.log(type);
    let ti = document.getElementsByClassName('text-input');
    let fi = document.getElementsByClassName('file-input');
    if(type=='t'){
        ti[0].style.display = "flex";
        fi[0].style.display = "none";
    }else{
        fi[0].style.display = "flex";
        ti[0].style.display = "none";
    }
}

function setData(type,input){
    let files = input.files;
    if(files.length == 0) return;
    const file = files[0];
    let reader = new FileReader();
    reader.onload = (e) => {
        if(type==0){ // old
            document.getElementById('ot').value = e.target.result;
        }else{
            document.getElementById('nt').value = e.target.result;
        }
    };
    reader.onerror = (e) => alert(e.target.error.name);
    reader.readAsText(file);

}


function formSubmit(form){
    let outputEl = document.getElementById('output');
    outputEl.innerHTML = `<span class="load">loading!!<span>`;

    let oldText = form.elements['ot'].value;
    let newText = form.elements['nt'].value;

    /**
     * 2. replace the multiple space to single spaces.
     * 3. Check for the condition in case any of one are empty.
     * 4. check for number of words ... if only one word then find diff by chars... else go for the words.
     */


    oldText = oldText.replace(/\n/g,' <br> ');
    newText = newText.replace(/\n/g,' <br> ');


    if(oldText == '' && newText == ''){
        // there is nothing to diff
        // show the message.
        console.log("All Empty : ",oldText,newText);
        outputEl.innerHTML = "";
        return;
    }

    if(oldText == ''){
        // only addition. whole newText will be in green 
        console.log("Old file empty : ",oldText,newText);
        outputEl.innerHTML = `<span class="add">${newText}</span>`;
        return;
    }
    if(newText == ''){
        // all deleted. whole oldText will be in red 
        console.log("New File Empty : ",oldText,newText);
        outputEl.innerHTML = `<span class="del">${oldText}</span>`;
        return;
    }

    let oldTextArray = oldText.split(' ');
    let newTextArray = newText.split(' ');
    oldTextArray.splice(0,0,"  ");
    newTextArray.splice(0,0,"  ");

    // let oldTextArray = "  "+oldText;
    // let newTextArray = "  "+newText;

    if(oldTextArray.length == 2 && newTextArray.length == 2){
        console.log("Checking by chars : ",oldTextArray[0],newTextArray[0]);
        findDiff(" "+oldTextArray[1]," "+newTextArray[1]);
    }
    else{
        console.log("Checking by words : ",oldTextArray,newTextArray);
        findDiff(oldTextArray,newTextArray);
    }

}