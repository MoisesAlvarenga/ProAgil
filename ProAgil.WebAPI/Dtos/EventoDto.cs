using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ProAgil.WebAPI.Dtos
{
    public class EventoDto{
        public int Id { get; set; }

        [Required(ErrorMessage = "Campo obrigatório")]
        [StringLength(100, MinimumLength =3, ErrorMessage = "Local é entre 3 e 100 caracteres")]
        public string Local { get; set; }
        public DateTime DataEvento { get; set; }

        [Required(ErrorMessage = "O tema deve ser preenchido")]
        public string Tema { get; set; }

        [Range(2, 120000, ErrorMessage = "Quantidade de pessoas entre 2 e 120.000")]
        public int QtdPessoas { get; set; }
        public string ImagemURL { get; set; }

        [Phone]
        public string Telefone { get; set; }

        [EmailAddress]
        public string Email { get; set; }
        public string Lote { get; set; }
        public List<LoteDto> Lotes { get; set; }
        public List<RedeSocialDto> RedesSociais { get; set; }
        public List<PalestranteDto> Palestrantes { get; set; }
    }
}