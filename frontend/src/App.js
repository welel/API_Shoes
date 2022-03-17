import './App.css';
import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  // API Connection
  const [page, setPage] = useState(1);
  const urlAPI = "https://localhost:44384/api/Products?page=" + page;

  const [data, setData] = useState([]);

  const [productDB, setProductDB] = useState([]);

    // Window Create
    const [showCreate, setShowCreate] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
  
    const [filteredResults, setFilteredResults] = useState([]);

    
  const [produto, setProduto] = useState([]);
  
  const [showErroNoID, setShowErroNoId] = useState(false);
  const [showTable, setShowTable] = useState(true);

  const [showInputId, setShowInputId] = useState(false);
  const [showInputName, setShowInputName] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(true);

  // Create the state of productInfoSelected
  const [productInfoSelected, setProductInfoSelected] = useState({
    id: '',
    name: '',
    description: '',
    price: ''
  });




  // Save the productDB that the user will insert into the form
  // Uses setProductInfoSelected to update the state
  const inputProductData = e => {
    const { name, value } = e.target;
    setProductInfoSelected({
      ...productInfoSelected, [name]: value
    });
  }

  const [totalpages, setTotalPages] = useState(0);

  const requestGet = async () => {
    await axios.get(urlAPI)
      .then(response => {
        setData(response.data.products);
        setTotalPages(response.data.pages);
        console.log(response.data);
      }).catch(() => {
        toast.error('Please contact an administrator!');
      });
  }

  const requestPost = async () => {
    delete productInfoSelected.id;
    if (productInfoSelected.name == "" || productInfoSelected.description == "" || productInfoSelected.price == "") {
      toast.error('Please, fill  all fields!');
      return;
    }

    if (productInfoSelected.price.includes(',')) {
      const priceReplaced = productInfoSelected.price.replace(',', '.');
      productInfoSelected.price = priceReplaced;
    }

    if (isNaN(productInfoSelected.price)) {
      toast.error('The price has to be a number.');
      return;
    }

    productInfoSelected.price = parseFloat(productInfoSelected.price)
    await axios.post(urlAPI, productInfoSelected)
      .then(response => {
        setProductDB(productDB.concat(response.data));
        setShowCreate(false);
        setFilteredResults("");
        toast.success('A new product with the id ' + response.data.id + ' has been created!');
      }).catch(() => {
        toast.error('We weren´t able to create the product');
      });
  }

  const requestDelete = async (id) => {
    const urlWithId = (urlAPI + "/" + id);
    await axios.delete(urlWithId)
      .then(response => {
        // .filter will 'loop' the table where the id is different than the id that we just deleted
        setProductDB(productDB.filter(product => product.id !== response.data));
        setShowDelete(false);
        toast.success('The product with the id ' + id + ' was deleted');
      }).catch(error => {
        console.log(error);
      });
  }

  const requestPut = async () => {
    if (productInfoSelected.name == "" || productInfoSelected.description == "" || productInfoSelected.price == "") {
      toast.error('Please, fill  all fields!');
      return;
    }

    if (productInfoSelected.price.toString().includes(',', 0)) {
      const priceReplaced = productInfoSelected.price.replace(',', '.');
      productInfoSelected.price = priceReplaced;
    }

    if (isNaN(productInfoSelected.price)) {
      toast.error('The price has to be a number.');
      return;
    }

    productInfoSelected.price = parseFloat(productInfoSelected.price)
    const urlEdit = (urlAPI + "/" + productInfoSelected.id);
    await axios.put(urlEdit, productInfoSelected)
      .then(response => {
        productDB.map(product => {
          if (product.id === productInfoSelected.id) {
            product.name = response.data.name;
            product.description = response.data.description;
            product.price = response.data.price;
          }
        });
        setShowEdit(false);
        toast.success('The product with the id ' + productInfoSelected.id + ' was edited');
      }).catch(error => {
        console.log(error);
      })
  }

  const selectProduct = (product, type) => {
    setProductInfoSelected(product);
    if (type == "Delete") {
      setShowDelete(true);
    } else if (type == "Edit") {
      setShowEdit(true);
    }
  }

  const requestFindById = async (searchId) => {
    const urlFind = (urlAPI + "/ProductById?id=" + searchId);
    await axios.get(urlFind)
      .then(response => {
        setShowErroNoId(false);
        setShowTable(true);
        if (searchId !== '') {
          setProduto(response.data);
          setFilteredResults(" ");
        } else {
          setFilteredResults("");
        }
      }).catch(() => {
        if (searchId == '') {
          setShowTable(true);
          setFilteredResults("");
        } else {
          setShowTable(false);
          setShowErroNoId(true);
        }
      })
  }

  const requestSearch = async (search) => {
    const urlFind = (urlAPI + "/GetAll?search=" + search);
    await axios.get(urlFind)
      .then(response => {
        setShowErroNoId(false);
        setShowTable(true);
        if (search !== '') {
          setProduto(response.data);
          setFilteredResults(" ");
        } else {
          setFilteredResults("");
        }
      }).catch(() => {
        if (search == '') {
          setShowTable(true);
          setFilteredResults("");
        } else {
          setShowTable(false);
          setShowErroNoId(true);
        }
      })
  }

  const requestFindByName = async (searchName) => {
    const urlFind = (urlAPI + "/ProductByName?name=" + searchName);
    await axios.get(urlFind)
      .then(response => {
        setShowErroNoId(false);
        setShowTable(true);
        if (searchName !== '') {
          setProduto(response.data);
          setFilteredResults(" ");
        } else {
          setFilteredResults("");
        }
      }).catch(() => {
        if (searchName == '') {
          setShowTable(true);
          setFilteredResults("");
        } else {
          setShowTable(false);
          setShowErroNoId(true);
        }
      })
  }

  const changeOptionSearch = async (searchOption) => {
    if(searchOption == "id"){
      setShowInputId(true);
      setShowInputName(false);
      setShowSearchInput(false);
      setShowErroNoId(false);
      return;
    }

    if(searchOption == "name"){
      setShowInputName(true);
      setShowInputId(false);
      setShowSearchInput(false);
      setShowErroNoId(false);
      return;
    }

    if(searchOption == "all"){
      setShowSearchInput(true);
      setShowInputId(false);
      setShowInputName(false);
      setShowErroNoId(false);
      return;
    }
  }

  useEffect(() => {
    requestGet();
  }, [page]);





  function CheckPages() {
    if(page < 1){
    return <div className="btn-Page">
        <button onClick={() => setPage(page - 1)}>Previous</button>
        <button>{page}</button>
        <button onClick={() => setPage(page + 1)}>Next</button>
    </div>;
    }

    if(page + 1 > totalpages){
      return <div className="btn-Page">
      <button onClick={() => setPage(page - 1)}>Previous</button>
      <button>{page}</button>
      <button onClick={() => setPage(page + 1)} disabled>Next</button>
  </div>;
    }

    if(page - 1 < 1){
      return <div className="btn-Page">
      <button onClick={() => setPage(page - 1)} disabled>Previous</button>
      <button>{page}</button>
      <button onClick={() => setPage(page + 1)}>Next</button>
  </div>;
    }

    if(page){
      return <div className="btn-Page">
      <button onClick={() => setPage(page - 1)}>Previous</button>
      <button>{page}</button>
      <button onClick={() => setPage(page + 1)}>Next</button>
  </div>;
    }
  }

  return (
    <div className="App">
      <ToastContainer />
      <div className="tableContainer">
        <div className="tableHeader">
          <h1>Products</h1>
        </div>
        <button className="btn createNew" onClick={() => setShowCreate(true)}>Create New Product</button>

        <div className="searchItems">
          {
            showSearchInput ?
              <input className="search todo" type="text" placeholder="Search..." name="search" autoComplete="off" onInput={(e) => requestSearch(e.target.value)} />
              : null
          }
          {
            showInputId ?
              <input className="search soId" type="text" placeholder="Search ID..." name="searchId" autoComplete="off" onInput={(e) => requestFindById(e.target.value)} />
              : null
          }

          {
            showInputName ?
              <input className="search soNome" type="text" placeholder="Search Name..." name="searchName" autoComplete="off" onInput={(e) => requestFindByName(e.target.value)} />
              : null
          }

          <select name="optionSearch" defaultValue={'all'} className="search search-options" onChange={(e) => changeOptionSearch(e.target.value)}>
            <option value="all">All</option>
            <option value="id">Id</option>
            <option value="name">Name</option>
          </select>
        </div>

        {
          showTable ?
            <table>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Options</th>
                </tr>
              </thead>
              {filteredResults.length == 0 ? (
                <tbody>
                  {data.map(product => (
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td>{product.name}</td>
                      <td>{product.description}</td>
                      <td>{product.price}</td>
                      <td>
                        <button className="btn edit-btn" onClick={() => selectProduct(product, "Edit")}>Edit</button>
                        <button className="btn delete-btn" onClick={() => selectProduct(product, "Delete")}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              ) : (
                <tbody>
                  {data.map(product => (
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td>{product.name}</td>
                      <td>{product.description}</td>
                      <td>{product.price}</td>
                      <td>
                        <button className="btn edit-btn" onClick={() => selectProduct(product, "Edit")}>Edit</button>
                        <button className="btn delete-btn" onClick={() => selectProduct(product, "Delete")}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table> : null
        }

<CheckPages />

        {
          showErroNoID ?
            <div className='errorFindId'>
              <p>We didn´t find a product with the that data.</p>
            </div> : null
        }
      </div>

      {
        showCreate ?
          <div className="modalWindow">
            <div className="containerModal">
              <div className="modalTitle"><h3>Create New Product</h3></div>
              <div className="modalBody">
                <div className="modalItem">
                  <label htmlFor="name">Name:</label>
                  <input type="text" id="name" name="name" onChange={inputProductData} />
                </div>
                <div className="modalItem">
                  <label htmlFor="description">Description:</label>
                  <input type="text" id="description" name="description" onChange={inputProductData} />
                </div>
                <div className="modalItem">
                  <label htmlFor="price">Price:</label>
                  <input type="text" id="price" name="price" onChange={inputProductData} />
                </div>
              </div>
              <div className="modalBtns">
                <button className="btn createNew" onClick={() => requestPost()}>Create</button>
                <button className="btn cancelBtn" onClick={() => setShowCreate(false)}>Cancel</button>
              </div>
            </div>
          </div> : null
      }

      {
        showDelete ?
          <div className="modalWindow">
            <div className="containerModal">
              <div className="modalTitle"><h3>Delete Product</h3></div>
              <div className="modalBody">
                <div className="modalItem">
                  <span>Are you sure you want to delete the product with id: {productInfoSelected.id}</span>
                </div>
              </div>
              <div className="modalBtns">
                <button className="btn cancelBtn" onClick={() => requestDelete(parseInt(productInfoSelected.id))}>Delete</button>
                <button className="btn createNew" onClick={() => setShowDelete(false)}>Cancel</button>
              </div>
            </div>
          </div> : null
      }

      {
        showEdit ?
          <div className="modalWindow">
            <div className="containerModal">
              <div className="modalTitle"><h3>Edit Product - {productInfoSelected.id}</h3></div>
              <div className="modalBody">
                <div className="modalItem">
                  <label htmlFor="name">Name:</label>
                  <input type="text" id="name" name="name" value={productInfoSelected.name} onChange={inputProductData} />
                </div>
                <div className="modalItem">
                  <label htmlFor="description">Description:</label>
                  <input type="text" id="description" name="description" value={productInfoSelected.description} onChange={inputProductData} />
                </div>
                <div className="modalItem">
                  <label htmlFor="price">Price:</label>
                  <input type="text" id="price" name="price" value={productInfoSelected.price} onChange={inputProductData} />
                </div>
              </div>
              <div className="modalBtns">
                <button className="btn createNew" onClick={() => requestPut(parseInt(productInfoSelected.id))}>Save</button>
                <button className="btn cancelBtn" onClick={() => setShowEdit(false)}>Cancel</button>
              </div>
            </div>
          </div> : null
      }

      {
        showSearch ?
          <div className="modalWindow">
            <div className="containerModal">
              <div className="modalTitle"><h3>Product - </h3></div>
              <div className="modalBody">
                <div className="modalItem">
                  <label htmlFor="name">Name:</label>
                  <input type="text" id="name" name="name" />
                </div>
                <div className="modalItem">
                  <label htmlFor="description">Description:</label>
                  <input type="text" id="description" name="description" />
                </div>
                <div className="modalItem">
                  <label htmlFor="price">Price:</label>
                  <input type="text" id="price" name="price" />
                </div>
              </div>
              <div className="modalBtns">
                <button className="btn createNew">Save</button>
                <button className="btn cancelBtn">Cancel</button>
              </div>
            </div>
          </div> : null
      }
    </div>
  );
}

export default App;
