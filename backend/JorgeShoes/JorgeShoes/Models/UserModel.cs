﻿using System;
using System.ComponentModel.DataAnnotations;

namespace JorgeShoes.Models
{
    public class UserModel
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Username { get; set; }

        [Required]
        public string Password { get; set; }

        [Required]
        public string Email { get; set; }

        [Required]
        public string Role { get; set; }

        [Required]
        public string Surname { get; set; }

        [Required]
        public string GivenName { get; set; }
    }
}