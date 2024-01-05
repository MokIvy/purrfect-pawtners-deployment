package com.purrfectpawtners.purrfectpawtners.controller;

import com.purrfectpawtners.purrfectpawtners.exception.EmptyPetListException;
import com.purrfectpawtners.purrfectpawtners.exception.ResourceNotFoundException;
import com.purrfectpawtners.purrfectpawtners.model.Breed;
import com.purrfectpawtners.purrfectpawtners.model.Pet;
import com.purrfectpawtners.purrfectpawtners.repository.BreedRepository;
import com.purrfectpawtners.purrfectpawtners.service.FileStorageService;
import com.purrfectpawtners.purrfectpawtners.service.PetService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.method.annotation.HandlerMethodValidationException;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.DELETE, RequestMethod.POST, RequestMethod.GET, RequestMethod.PUT})
@RestController
@RequestMapping("/pets")
public class PetController {

    @Autowired
    private PetService petService;

    @Autowired
    private BreedRepository breedRepository;

    @Autowired
    private FileStorageService fileStorageService;

    // Get all pets with their breeds
    @GetMapping
    public List<Pet> getAllPetsWithBreeds() {
        return petService.getAllPetsWithBreeds();
    }

    // Get all pets, optionally filtered by name
    @GetMapping("/all")
    public ResponseEntity<List<Pet>> getAllPets(@RequestParam(required = false) String name)
            throws EmptyPetListException {
        List<Pet> result;
        if (name == null) {
            result = petService.getAllPets();
        } else {
            result = petService.findByPetName(name);
        }

        if (result.isEmpty()) {
            throw new EmptyPetListException("No pet(s) available.");
        }
        return ResponseEntity.ok(result);
    }

    // Get a pet by ID
    @GetMapping("/id/{id}")
    public ResponseEntity<Pet> getPetById(@PathVariable("id") Integer id) throws ResourceNotFoundException {
        Pet result = petService.findPetById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No pet found under id: " + id));
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    // Get pets by name
    @GetMapping("/name")
    public ResponseEntity<List<Pet>> getPetByName(@RequestParam(required = true) String name) {
        List<Pet> pets = petService.findByPetName(name);
        if (pets.isEmpty()) {
            throw new ResourceNotFoundException("No pets found for pet name: " + name);
        }
        return new ResponseEntity<>(pets, HttpStatus.OK);
    }

    // Get pets by gender
    @GetMapping("/gender/{gender}")
    public ResponseEntity<List<Pet>> getPetByGender(@PathVariable("gender") Pet.Gender gender)
            throws EmptyPetListException {
        List<Pet> allPetsByGender = petService.findByPetGender(gender);
        if (allPetsByGender.isEmpty()) {
            throw new EmptyPetListException("No " + gender + " pets available.");
        }
        return ResponseEntity.ok(allPetsByGender);
    }

    // Get pets by type
    @GetMapping("/type")
    public ResponseEntity<List<Pet>> getPetByType(@RequestParam(required = true) Pet.Type type)
            throws EmptyPetListException {
        List<Pet> allPetsByType = petService.findByPetType(type);
        if (allPetsByType.isEmpty()) {
            throw new EmptyPetListException("No " + type + " list available.");
        }
        return ResponseEntity.ok(allPetsByType);
    }

    // Get all HDB-approved pets
    @GetMapping("/approved")
    public ResponseEntity<List<Pet>> getAllApprovedPets() throws EmptyPetListException {
        List<Pet> allApprovedPets = petService.findByHdbApprovedStatus(true);
        if (allApprovedPets.isEmpty()) {
            throw new EmptyPetListException("No HDB-approved pets available.");
        }
        return ResponseEntity.ok(allApprovedPets);
    }

    // Get all non-HDB-approved pets
    @GetMapping("/non-approved")
    public ResponseEntity<List<Pet>> getAllNonApprovedPets() throws EmptyPetListException {
        List<Pet> allNonApprovedPets = petService.findByHdbApprovedStatus(false);
        if (allNonApprovedPets.isEmpty()) {
            throw new EmptyPetListException("No non HDB-approved pets available.");
        }
        return ResponseEntity.ok(allNonApprovedPets);
    }

    // Filter pets based on criteria
    @GetMapping("/filter")
    public ResponseEntity<List<Pet>> filterPets(
            @RequestParam(required = false) Pet.Type type,
            @RequestParam(required = false) Pet.Gender gender,
            @RequestParam(required = false) Boolean isApproved) throws EmptyPetListException {
        List<Pet> filteredPets = petService.filterPets(type, gender, isApproved);

        if (filteredPets.isEmpty()) {
            throw new EmptyPetListException("No pets matching the specified criteria.");
        }

        return ResponseEntity.ok(filteredPets);
    }

    // Create a new pet
    @PostMapping("/")
    public ResponseEntity<?> createPet(
            @RequestParam("pawtnerName") String pawtnerName,
            @RequestParam("pawtnerAgeYear") String pawtnerAgeYear,
            @RequestParam("pawtnerAgeMonths") String pawtnerAgeMonths,
            @RequestParam("pawtnerGender") String pawtnerGender,
            @RequestParam("pawtnerColour") String pawtnerColour,
            @RequestParam("pawtnerAVSLicensed") String pawtnerAVSLicensed,
            @RequestParam("pawtnerHDBApproved") String pawtnerHDBApproved,
            @RequestParam("pawtnerSpayNeuter") String pawtnerSpayNeuter,
            @RequestParam("pawtnerTraining") String pawtnerTraining,
            @RequestParam("pawtnerTemperament") String pawtnerTemperament,
            @RequestParam("pawtnerType") String pawtnerType,
            @RequestParam("pawtnerBreed") String pawtnerBreed,
            @RequestParam("pawtnerImage") MultipartFile file) {

        try {
            // Convert the string values to appropriate types
            int pawtnerAgeYearInt = Integer.parseInt(pawtnerAgeYear);
            int pawtnerAgeMonthsInt = Integer.parseInt(pawtnerAgeMonths);
            int pawtnerBreedInt = Integer.parseInt(pawtnerBreed);
            boolean pawtnerAVSLicensedBool = pawtnerAVSLicensed.equalsIgnoreCase("yes");
            boolean pawtnerHDBApprovedBool = pawtnerHDBApproved.equalsIgnoreCase("yes");
            boolean pawtnerSpayNeuterBool = pawtnerSpayNeuter.equalsIgnoreCase("yes");

            Pet.Gender pawtnerGenderEnum = Pet.Gender.valueOf(pawtnerGender);
            Pet.Type pawtnerTypeEnum = Pet.Type.valueOf(pawtnerType);

            String imagePath = fileStorageService.storeFile(file);

            // Check if the breed exists
            Breed breed = breedRepository.findById(pawtnerBreedInt)
                    .orElseThrow(() -> new ResourceNotFoundException("Breed not found with id: " + pawtnerBreedInt));

            // Create a new Pet object and set its properties
            Pet pet = new Pet();
            pet.setName(pawtnerName);
            pet.setAgeYear(pawtnerAgeYearInt);
            pet.setAgeMonths(pawtnerAgeMonthsInt);
            pet.setGender(pawtnerGenderEnum);
            pet.setColor(pawtnerColour);
            pet.setIsLicensed(pawtnerAVSLicensedBool);
            pet.setIsApproved(pawtnerHDBApprovedBool);
            pet.setIsNeutered(pawtnerSpayNeuterBool);
            pet.setTraining(pawtnerTraining);
            pet.setTemperament(pawtnerTemperament);
            pet.setType(pawtnerTypeEnum);
            pet.setImagePath(imagePath);
            pet.setBreed(breed);

            // Save the pet
            Pet createdPet = petService.createPet(pet);
            return new ResponseEntity<>(createdPet, HttpStatus.CREATED);

        } catch (NumberFormatException e) {
            return new ResponseEntity<>("Invalid breed ID format: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (ResourceNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Internal Server Error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Upload an image file
    @PostMapping("/uploadImage")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        String fileName = fileStorageService.storeFile(file);

        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/uploads/")
                .path(fileName)
                .toUriString();

        return ResponseEntity.ok(fileDownloadUri);
    }

    // Update an existing pet

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updatePet(
            @PathVariable("id") Integer id,
            @RequestParam("pawtnerName") String pawtnerName,
            @RequestParam("pawtnerAgeYear") String pawtnerAgeYear,
            @RequestParam("pawtnerAgeMonths") String pawtnerAgeMonths,
            @RequestParam("pawtnerGender") String pawtnerGender,
            @RequestParam("pawtnerColour") String pawtnerColour,
            @RequestParam("pawtnerAVSLicensed") String pawtnerAVSLicensed,
            @RequestParam("pawtnerHDBApproved") String pawtnerHDBApproved,
            @RequestParam("pawtnerSpayNeuter") String pawtnerSpayNeuter,
            @RequestParam("pawtnerTraining") String pawtnerTraining,
            @RequestParam("pawtnerTemperament") String pawtnerTemperament,
            @RequestParam("pawtnerType") String pawtnerType,
            @RequestParam("pawtnerBreed") String pawtnerBreed,
            @RequestParam(value = "pawtnerImage", required = false) MultipartFile file) {

        try {
            // Convert string values to appropriate types and validate
            int pawtnerAgeYearInt = Integer.parseInt(pawtnerAgeYear);
            int pawtnerAgeMonthsInt = Integer.parseInt(pawtnerAgeMonths);
            int pawtnerBreedInt = Integer.parseInt(pawtnerBreed);
            boolean pawtnerAVSLicensedBool = pawtnerAVSLicensed.equalsIgnoreCase("yes");
            boolean pawtnerHDBApprovedBool = pawtnerHDBApproved.equalsIgnoreCase("yes");
            boolean pawtnerSpayNeuterBool = pawtnerSpayNeuter.equalsIgnoreCase("yes");
            Pet.Gender pawtnerGenderEnum = Pet.Gender.valueOf(pawtnerGender);
            Pet.Type pawtnerTypeEnum = Pet.Type.valueOf(pawtnerType);
            Breed breed = breedRepository.findById(pawtnerBreedInt)
                    .orElseThrow(() -> new ResourceNotFoundException("Breed not found with id: " + pawtnerBreedInt));


            // Fetch existing pet and update its properties
            Pet existingPet = petService.findPetById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Pet not found under id: " + id));
            existingPet.setName(pawtnerName);
            existingPet.setAgeYear(pawtnerAgeYearInt);
            existingPet.setAgeMonths(pawtnerAgeMonthsInt);
            existingPet.setGender(pawtnerGenderEnum);
            existingPet.setColor(pawtnerColour);
            existingPet.setIsLicensed(pawtnerAVSLicensedBool);
            existingPet.setIsApproved(pawtnerHDBApprovedBool);
            existingPet.setIsNeutered(pawtnerSpayNeuterBool);
            existingPet.setTraining(pawtnerTraining);
            existingPet.setTemperament(pawtnerTemperament);
            existingPet.setType(pawtnerTypeEnum);
            existingPet.setBreed(breed);
            if(!file.isEmpty()){
                String imagePath = fileStorageService.storeFile(file);
                existingPet.setImagePath(imagePath);
            }

            // Save the updated pet
            Pet updatedPet = petService.updatePet(existingPet);
            return new ResponseEntity<>(updatedPet, HttpStatus.OK);
        } catch (NumberFormatException e) {
            return new ResponseEntity<>("Invalid format: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (ResourceNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Internal Server Error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Delete a pet
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Optional<Pet>> deletePet(@Valid @PathVariable("id") Integer id) {
        Pet deletedPet = petService.findPetById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pet not found under id: " + id));
        return new ResponseEntity<>(petService.deletePet(id), HttpStatus.OK);
    }
}
