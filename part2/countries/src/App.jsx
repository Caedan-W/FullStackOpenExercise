import { useState, useEffect } from 'react'
import coutriesService from './services/coutries'


const Search = ({value, onChange}) => {
  return(
    <div>
      find coutries <input value={value} onChange={onChange}/>
    </div>
  )
}

const DisplayCountryDetails = ({countryDetails}) => {
  return (
    <div>
      <h1>{countryDetails[0].name.common}</h1>
      <p>capital {countryDetails[0].capital[0]}</p>
      <p>area {countryDetails[0].area}</p>
      <h2>languages:</h2>
      <ul>
        {Object.values(countryDetails[0].languages).map(language => (
            <li>{language}</li>
          ))}
      </ul>
      <img src={countryDetails[0].flags.svg} alt={countryDetails[0].flags.alt} />
    </div>  
  )
}

const DisplayCountries = ({countries, countryDetails, handleShow}) => {
  if (countries.length > 10){
    return(
      <>Too many matches, specify another filter</>
    )
  }
  else if (countries.length > 1){
    return(
      <div>
      <ul>
        {countries.map((countryNameSet, index) => (
          //<li>{countryNameSet.join(',')}</li>
          //<li dangerouslySetInnerHTML={{__html: countryNameSet.join('<br>')}}></li>
          <span key={index}>
            <li>
              {countryNameSet.map((name, i) => (
                <span key={i}>
                  {i === 0 ? 
                    <p><strong>Common Name：</strong> <button onClick={()=>handleShow(countryNameSet)}>show</button></p>
                    :
                    (i === 1 ? <span><strong>Other Names：</strong></span> : null)
                  }
                  {name}
                  {/* 在每个元素之后插入一个换行符 */}
                  {i !== countryNameSet.length - 1 && <br />}
                </span>
              ))}
            </li>
            <br />
          </span>
        ))}
      </ul>
    </div>
    )
  }
  else if (countries.length === 1){
    console.log('countryDetails:', countryDetails)
    //console.log('countryDetails[0]', countryDetails[0])
    console.log('countryDetails[0].name.common', countryDetails[0].name.common)
    console.log('countryDetails[0].capital[0]', countryDetails[0].capital[0])
    console.log('countryDetails[0].languages', countryDetails[0].languages)
    return(
        <DisplayCountryDetails countryDetails={countryDetails} />
    )
  }else {
    return <div>No countries matched</div>;
  }
}


function App() {
  const [countries, setCountries] = useState([])
  const [searchInput, setSearchInput] = useState('')
  const [selectedCountryDetails, setSelectedCountryDetails] = useState(null);


  console.log('countries: ', countries)
  //let countryDetails = countries.map(country => {country.capital, country.area, country.languages, country.flags})

  let countriesName = countries.map(country => country.name)
  console.log('countries.name: ', countriesName)
  let countriesNameValueArray = countriesName.map(item => Object.values(item))
  //e.g., countriesNameValueArray[0]={'kuwait','State of Kuwait', nativeNameObject}
  console.log('countriesNameValueArray: ', countriesNameValueArray)


  //单次flat函数
  const flattenArray = (arrayToFlat) => {
    let res = arrayToFlat.reduce((acc, curr) => {
      if (typeof curr === 'string'){
        acc.push(curr)
      }
      else {
        acc = acc.concat(Object.values(curr))
      }
      return acc
    }, [])
    return res
  }

  // 检查数组中的元素是否都是string
  const allFlat = (array) => {
    return array.every(item => typeof item === 'string')
  }

  // 循环展平数组，直到所有元素都是string为止
  const loopFlattenArray = (bigArray) => {
    let temp = flattenArray(bigArray)
    //console.log('temp:',temp)
    while (!allFlat(temp)) {
      temp = [...flattenArray(temp)]
    }
    return temp
  }

  // 循环展平数组，直到所有元素都是平铺的数组为止
  const flattenNestedArrays = (arr) => {
    let flattened = [];
    Array.from(arr).forEach(item => {
        if (typeof item !== 'string') {
            flattened.push(loopFlattenArray(item)); // 展平嵌套数组
        } else {
            flattened.push(item);
        }
    });
    return flattened;
  }
  /*
  let mixedArray = ["Kuwait", "State of Kuwait", {official: 'دولة الكويت', common: 'الكويت'}]

  let mixedArray2 = ["Kuwait", "State of Kuwait", {arb: {official: 'دولة الكويت', common: 'الكويت'}}]

  let mixedArray3 = [[...mixedArray], 'CHINA']

  let result = flattenArray(mixedArray3)
  console.log('result: ',result)
  //console.log('flat?',allFlat(result))
  let result3 = loopFlattenArray(mixedArray3)
  console.log('result3: ', result3)
  let result4 = flattenNestedArrays(mixedArray3)
  console.log('result4: ', result4)
  */
  
  let flatCountriesNameValueArray = flattenNestedArrays(countriesNameValueArray)
  console.log('flatCountriesNameValueArray: ', flatCountriesNameValueArray)

  let countryNamesToShow = flatCountriesNameValueArray.filter(
    countryNameSet => Object.values(countryNameSet).some(
      value => value.toLowerCase().includes(searchInput.toLowerCase())
    )
  )

  console.log('countryNamesToShow:',countryNamesToShow)

  const findSelectedElements = (array, nameArray) => {
    const selectedElements = [];
    array.forEach(element => {
      const nameObject = element.name
      const nameContent = Object.values(nameObject)
      //console.log('nameObject', nameObject)
      //console.log('nameContent', nameContent)

      // 检查name的content是否在nameArray中的任何一个子数组中
      const nameInNameArray = nameArray.some(countryNames => {
        if (Array.isArray(nameContent)) {
          return nameContent.some(name => countryNames.includes(name));
        } else if (typeof nameContent === 'object') {
          return Object.values(nameContent).some(name => countryNames.includes(name));
        } else {
          return countryNames.includes(nameContent);
        }
      });
    
        if (nameInNameArray) {
          selectedElements.push(element);
        }
    });
    return selectedElements;
  };
  
  // 调用函数并输出选中的元素
  const selectedCountriesDetails = findSelectedElements(countries, countryNamesToShow);
  console.log('selectedCountries:',selectedCountriesDetails);

  
  useEffect(() => {
    console.log('effect')
    coutriesService
      .getAll()
      .then(initialCoutries => {
        console.log('promise fulfilled')
        setCountries(initialCoutries)
      })
  }, [])
  

  const handleSearchInput = (event) => {
    setSearchInput(event.target.value)
    setSelectedCountryDetails(null)
    console.log('new filter input:', event.target.value)
  }

  const handleCountrySelect = (countryNameSet) => {
    // Find the selected country details from the countries array
    const selectedCountry = countries.find(country =>
      country.name.common === countryNameSet[0]
    );
    console.log('FOUND',selectedCountry)
    // Set the selected country details in the state
    setSelectedCountryDetails(selectedCountry);
  };

  /*
  if(selectedCountryDetails === null){
    return (
      <>
        <Search value={searchInput} onChange={handleSearchInput} />
  
        <DisplayCountries countries={countryNamesToShow} 
                          countryDetails={selectedCountriesDetails}
                          handleShow={handleCountrySelect}
        />
      </>
    )
  }
  else {
    return <DisplayCountryDetails countryDetails={[selectedCountryDetails]} />;
  }
  */

  return (
    <>
      <Search value={searchInput} onChange={handleSearchInput} />
  
      {selectedCountryDetails ? (
        <DisplayCountryDetails countryDetails={[selectedCountryDetails]} />
      ) : (
        <DisplayCountries
          countries={countryNamesToShow}
          countryDetails={selectedCountriesDetails}
          handleShow={handleCountrySelect}
        />
      )}
    </>
  );
  
}

export default App
