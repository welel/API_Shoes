﻿using JorgeShoes.DTO;
using JorgeShoes.Models;
using JorgeShoes.Response;
using JorgeShoes.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace JorgeShoes.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        private UserModel GetCurrentUser()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;

            if(identity != null)
            {
                var userClaims = identity.Claims;

                return new UserModel
                {
                    Username = userClaims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value,
                    Email = userClaims.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value,
                    Role = userClaims.FirstOrDefault(x => x.Type == ClaimTypes.Role)?.Value,
                };
            }
            return null;
        }

        [HttpGet("GetAllUsers")]
        public async Task<ActionResult<UserModel>> GetAll(int page, float entries, string search, string searchBy, string order)
        {
            try
            {
                var users = await _userService.GetAll(page, entries, search, searchBy, order);
                if(users == null)
                {
                    return NotFound("We weren´t able to find users");
                }
                else
                {
                    return Ok(users);
                }
            }
            catch
            {
                throw;
            }
        }

        [HttpGet("GetByUserId")]
        public async Task<ActionResult<UserModel>> GetById(int id)
        {
            try
            {
                var user = await _userService.GetById(id);
                if (user == null)
                {
                    return NotFound($"We weren´t able to find a user with the id of {id}");
                }
                else
                {
                    return Ok(user);
                }
            }
            catch
            {
                throw;
            }
        }

        [HttpPost("Create")]
        public async Task<ActionResult<UserModel>> CreateUser(UserModel user)
        {
            try
            {
                await _userService.CreateUser(user);
                return user;
            }
            catch
            {
                throw;
            }
        }
    }
}