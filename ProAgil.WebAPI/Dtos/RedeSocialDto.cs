using System.ComponentModel.DataAnnotations;
using System.Net.Cache;
namespace ProAgil.WebAPI.Dtos
{
    public class RedeSocialDto
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        public string Nome { get; set; }

        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        public string URL { get; set; }
    }
}