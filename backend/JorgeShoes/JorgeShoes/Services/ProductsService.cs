﻿using JorgeShoes.Context;
using JorgeShoes.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace JorgeShoes.Services
{
    public class ProductsService : IProductService
    {

        private readonly AppDbContext _context;

        public ProductsService(AppDbContext context)
        {
            _context = context;
        }

        //public async Task<ActionResult<List<Product>>> GetProducts(int page)
        //{
        //    try
        //    {
        //        var pageResults = 3f;
        //        var pageCount = Math.Ceiling(_context.Products.Count() / pageResults);

        //        if (page > pageCount)
        //            throw new Exception();

        //        if (page <= 0)
        //            throw new Exception();

        //        var products = await _context.Products
        //            .Skip((page - 1) * (int)pageResults)
        //            .Take((int)pageResults)
        //            .ToListAsync();


        //        var response = new ProductResponse
        //        {
        //            Products = products,
        //            CurrentPage = page,
        //            Pages = (int)pageCount
        //        };

        //        return (products);
        //    }
        //    catch
        //    {
        //        throw;
        //    }
        //}

        public async Task<IEnumerable<Product>> GetProducts()
        {
            try
            {
                var products = await _context.Products.ToListAsync();
                return products;
            }
            catch
            {
                throw;
            }
        }

        public async Task<IEnumerable<Product>> GetProductsByName(string name)
        {
            IEnumerable<Product> products;
            if (!string.IsNullOrEmpty(name))
            {
                products = await _context.Products.Where(n => n.Name.Contains(name)).ToListAsync();
            }
            else
            {
                products = await _context.Products.ToListAsync();
            }
            return products;
        }


        public async Task<Product> GetProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            return product;
        }

        public async Task CreateProduct(Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateProduct(Product product)
        {
            _context.Entry(product).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteProduct(Product product)
        {
            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Product>> GetProductsById(int id)
        {
            IEnumerable<Product> products;
            if (!string.IsNullOrEmpty(id.ToString()))
            {
                products = await _context.Products.Where(b => b.Id.ToString().Contains(id.ToString())).ToListAsync();
            }
            else
            {
                products = await _context.Products.ToListAsync();
            }
            return products;
        }

        public async Task<IEnumerable<Product>> GetAll(string search)
        {
            IEnumerable<Product> products;
            if (!string.IsNullOrEmpty(search)) 
            { 
                products = await _context.Products.Where(n => n.Id.ToString().Contains(search.ToString()) || n.Name.Contains(search) || n.Description.Contains(search) || n.Price.ToString().Contains(search.ToString())).ToListAsync();
            }
            else
            {
                    products = await _context.Products.ToListAsync();
            }
            return products;
        }

        public async Task<IEnumerable<Product>> Order(string option)
        {

            var produtos = from s in _context.Products
                           select s;
            switch (option)
            {
                case "id_desc":
                    produtos = produtos.OrderByDescending(s => s.Id);
                    break;
                case "name":
                    produtos = produtos.OrderBy(s => s.Name);
                    break;
                case "name_desc":
                    produtos = produtos.OrderByDescending(s => s.Name);
                    break;
                case "description":
                    produtos = produtos.OrderBy(s => s.Description);
                    break;
                case "description_desc":
                    produtos = produtos.OrderByDescending(s => s.Description);
                    break;
                case "price":
                    produtos = produtos.OrderBy(s => s.Price);
                    break;
                case "price_desc":
                    produtos = produtos.OrderByDescending(s => s.Price);
                    break;
                default:
                    produtos = produtos.OrderBy(s => s.Id);
                    break;
            }
            return await produtos.AsNoTracking().ToListAsync();
        }
    }
}
