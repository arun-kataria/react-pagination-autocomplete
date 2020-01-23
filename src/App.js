import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [searchArray, setSearchArray] = useState([]);
  let [apiItems, setApiItems] = useState([]);
  let [pageCount, setPageCount] = useState(1);
  let [totalCount, settotalCount] = useState(0);


  useEffect(() => {
    console.log("update");
    getResp();
  }, [pageCount]);

  function getResp() {

    fetch(`https://reqres.in/api/users?page=${pageCount}`)
      .then(res => res.json())
      .then(res => {
        console.log("rep===", res)
        let respItem = res.data;
        setApiItems(respItem)
        console.log("res.total-- ", res.total);
        settotalCount(res.total)
      })
      .catch((e) => console.log("Error:", e));
  }



  var timer;
  if (typeof localStorage.getItem('searchItems') == 'string') {
    localStorage.setItem('searchItems', JSON.stringify({}));
  }

  function changeHandler(e) {
    if (timer) {
      clearTimeout(timer);
      timer = setTimeout(startStore, 1500, e.target.value);
    } else timer = setTimeout(startStore, 1500, e.target.value);

    function startStore(value) {
      let sortArray = [];
      let searchItem = JSON.parse(localStorage.getItem('searchItems'));
      var foundValue = '',
        found = false;
      Object.keys(searchItem).forEach(k => {
        if (k.includes(value)) {
          foundValue = k;
          found = true;
        }
      })
      if (searchItem[value]) {
        searchItem[value]++;
        sortArray.push([value, searchItem[value]])
      } else if (found) {
        searchItem[foundValue]++;
        sortArray.push([foundValue, searchItem[foundValue]])
      } else {
        searchItem[value] = 1;
        for (var key in searchItem) {
          sortArray.push([key, searchItem[key]]);
        }
        sortArray.sort(function (a, b) {
          return a[1] - b[1];
        }).reverse()
      }
      setSearchArray(sortArray)
      localStorage.setItem('searchItems', JSON.stringify(searchItem));
    }
  }
  function pageHandler(value) {
    let count = pageCount;
    switch (value) {
      case '1':
        setPageCount(count = 0)
        break;
      case '2':
        count++;
        if (count > Math.floor(totalCount / 6))
          count = Math.floor(totalCount / 6)
        setPageCount(count);
        break;
      case '3':
        count--;
        if (count < 1)
          count = 1;
        setPageCount(count);
        break;
      case '4':
        setPageCount(Math.floor(totalCount / 6))
        break;
      default:
        setPageCount(0)
        break;
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className='table-data'>
          <table style={{ "width": "100%" }}>
            <tr>
              <th>Firstname</th>
              <th>Lastname</th>
              <th>Age</th>
            </tr>
            {apiItems ? apiItems.map(i => <tr><td>{i.first_name}</td><td>{i.last_name}</td> </tr>) : null}
          </table>
          <button onClick={() => pageHandler('1')}>First</button>
          <button onClick={() => pageHandler('2')}>Next</button>
          <button onClick={() => pageHandler('3')}>Previous</button>
          <button onClick={() => pageHandler('4')}>Last</button>
        </div>
        <div>
          <input type="text" name='search-text' onChange={changeHandler} placeholder="Search" />
          {searchArray && searchArray.map((element, index) => <div key={index} className='search-bar'>{element[0]}</div>)}
        </div>

      </header>
    </div>
  );
}

export default App;
