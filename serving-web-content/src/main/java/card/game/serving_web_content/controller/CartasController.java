package card.game.serving_web_content.controller;

import card.game.serving_web_content.model.Cartas;
import card.game.serving_web_content.service.CartasService;
import jakarta.validation.Valid;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.ArrayList;
import java.util.List;


@RestController
@RequestMapping("/api/cartas")
public class CartasController {
    private final CartasService cartasService;

    static List<String> idiomaList;
    static List<String> franquiaList;

    static{
        franquiaList = new ArrayList<>();
        franquiaList.add("Yu-Gi-Oh!");
        franquiaList.add("Pokémon");
        franquiaList.add("Magic");
        franquiaList.add("Digimon");
        franquiaList.add("Outro");

        idiomaList = new ArrayList<>();
        idiomaList.add("Português");
        idiomaList.add("Inglês");
        idiomaList.add("Espanhol");
        idiomaList.add("Alemão");
        idiomaList.add("Italiano");
        idiomaList.add("Francês");
    }

    @Autowired
    public CartasController(CartasService cartasService) {this.cartasService = cartasService;}

    @GetMapping
    public ResponseEntity<List<Cartas>> listar(){
        return ResponseEntity.ok(cartasService.listarCartas());
    }
    @GetMapping("/acharNome")
    public ResponseEntity<List<Cartas>> acharNome(@RequestParam("nome") String nomeKey){
        return ResponseEntity.ok(cartasService.acharNome(nomeKey));
    }
    @PostMapping
    public ResponseEntity<Cartas> cadastrar(@Valid @RequestBody Cartas c){
        Cartas salvo = cartasService.cadastrarCarta(c);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Cartas> atualizar(@PathVariable Long id,
                                            @Valid @RequestBody Cartas cartaAtualizada){
        card.game.serving_web_content.model.Cartas atualizado = cartasService.atualizarCarta(id, cartaAtualizada);
        return ResponseEntity.ok(atualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> excluir(@PathVariable Long id){
        cartasService.excluirCarta(id);
        return ResponseEntity.noContent().build();
    }
}
