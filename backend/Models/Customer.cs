using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace OnboardingTask.Models;

public partial class Customer
{
    public int Id { get; set; }

    [Required(ErrorMessage = "Customer name is required.")]
    public string Name { get; set; } = null!;

    [Required(ErrorMessage = " Customer address is required.")]
    public string Address { get; set; } = null!;

   //public virtual ICollection<Sale> Sales { get; set; } = new List<Sale>();
}
