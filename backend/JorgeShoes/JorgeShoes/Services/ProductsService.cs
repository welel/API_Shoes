﻿using JorgeShoes.Context;
using JorgeShoes.Models;
using Microsoft.EntityFrameworkCore;
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

        public async Task<IEnumerable<Product>> GetProducts()
        {
            try
            {
                return await _context.Products.ToListAsync();
            }
            catch
            {
                throw;
            }
        }

        public async Task<IEnumerable<Product>> GetProductByName(string name)
        {
            IEnumerable<Product> products;
            if (!string.IsNullOrEmpty(name))
            {
                products = await _context.Products.Where(n => n.Name.Contains(name)).ToListAsync();
            }
            else
            {
                products = await GetProducts();
            }
            return products;
        }

        public async Task<IEnumerable<Product>> GetProductByPrice(int price)
        {
            IEnumerable<Product> products;
            if (!string.IsNullOrEmpty(price.ToString()))
            {
                products = await _context.Products.Where(b => b.Price.Equals(price)).ToListAsync();
            }
            else
            {
                products = await GetProducts();
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
    }
}