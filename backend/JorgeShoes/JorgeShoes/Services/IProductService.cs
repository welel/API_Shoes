﻿using JorgeShoes.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace JorgeShoes.Services
{
    public interface IProductService
    {
        Task<ProductResponse> GetProducts(int page, float entries, string searchBy, string search);
        Task<Product> GetProduct(int id);
        Task CreateProduct(Product product);
        Task UpdateProduct(Product product);
        Task<bool> DeleteProduct(Product product);
        //Task<IEnumerable<Product>> GetAll(string search);
        //Task<IEnumerable<Product>> Order(string option);
    }
}