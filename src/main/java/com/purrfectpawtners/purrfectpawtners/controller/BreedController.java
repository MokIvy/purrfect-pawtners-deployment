package com.purrfectpawtners.purrfectpawtners.controller;

import com.purrfectpawtners.purrfectpawtners.model.Breed;
import com.purrfectpawtners.purrfectpawtners.service.BreedService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.DELETE, RequestMethod.POST, RequestMethod.GET, RequestMethod.PUT})
@RestController
@RequestMapping("/breed")
public class BreedController {

    @Autowired
    private BreedService breedService;

    @GetMapping("/all")
    public ResponseEntity<List<Breed>> getAllPets(){
        List<Breed> allBreed = breedService.getAllPets();
        return ResponseEntity.ok(allBreed);
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<Breed>> getBreedByType(@PathVariable("type")Breed.Type type){
        List<Breed> allBreedByType = breedService.findByBreedType(type);
        return ResponseEntity.ok(allBreedByType);
    }
}
