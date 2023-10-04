using System.ComponentModel.DataAnnotations;

namespace TestAJAXQuery.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string? Name { get; set; }
        [Range(18, 100)]
        public int Age { get; set; }
    }
}
