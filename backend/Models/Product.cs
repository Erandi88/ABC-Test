using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace OnboardingTask.Models;

public partial class Product
{
    public int Id { get; set; }

    [Required(ErrorMessage = "Product name is required.")]
    public string Name { get; set; } = null!;

    [Required(ErrorMessage = "Product Price is required.")]
    public decimal Price { get; set; }

    //public virtual ICollection<Sale> Sales { get; set; } = new List<Sale>();
}
