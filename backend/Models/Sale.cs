using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace OnboardingTask.Models;

public partial class Sale
{
    public int Id { get; set; }

    [Required(ErrorMessage = "Product is required.")]
    public int ProductId { get; set; }

    [Required(ErrorMessage = "Customer is required.")]
    public int CustomerId { get; set; }

    [Required(ErrorMessage = "Store is required.")]
    public int StoreId { get; set; }

    [Required(ErrorMessage = "Date Sold is required.")]
    [DataType(DataType.Date, ErrorMessage = "Date Sold must be a valid date.")]
    public DateTime DateSold { get; set; }

    public virtual Customer Customer { get; set; } = null!;

    public virtual Product Product { get; set; } = null!;

    public virtual Store Store { get; set; } = null!;
}
public class Salepost
{
    public int Id { get; set; }

    [Required(ErrorMessage = "Product is required.")]
    public int ProductId { get; set; }

    [Required(ErrorMessage = "Customer is required.")]
    public int CustomerId { get; set; }

    [Required(ErrorMessage = "Store is required.")]
    public int StoreId { get; set; }

    [Required(ErrorMessage = "Date Sold is required.")]
    public DateTime DateSold { get; set; }


}



