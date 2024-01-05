class PetsApiService {
    // TechDebt: Save variable in environment and reference from there
    baseApiUrl = 'https://flaky-square-production.up.railway.app';
    constructor() {}

    async getBreeds(petType) {
        const breedUrl = `${this.baseApiUrl}/breed/type/${petType}`;
        
        try{
            let response = await fetch(breedUrl);
            let breeds = await response.json();
            return breeds;
        } catch (error) {
            console.error("Error fetching breeds: ", error);
        }
    }

    async getPetIdByName(petName){
        const petNameUrl = `${this.baseApiUrl}/pets/name?name=${encodeURIComponent(petName)}`;

        try{
            let response = await fetch(petNameUrl);
            let data = await response.json();
            return data.length > 0 ? data[0].id : null;
        } catch(error){
            console.error("Error fetching petId: ", error)
        }
    }

    async getPetDetails(petId) {
        const petUrl = `${this.baseApiUrl}/pets/id/${petId}`;

        try{
            let response = await fetch(petUrl);
            let petDetails = await response.json();
            return petDetails;
        } catch(error) {
            console.error("Error fetching pet details: ", error)
        }
    }

    async getAllPets() {
        try {
            let response = await fetch(`${this.baseApiUrl}/pets/all`);
            let data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching data from API: ", error);
        }
    }

    async filterPets(validFilters) {
        const apiUrl =
        `${this.baseApiUrl}/pets/filter?` +
        validFilters
          .map((filter) => `${filter.name}=${filter.value}`)
          .join("&");

        try {
            let response = await fetch(apiUrl);
            let data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    async deletePet(petId){
        const deleteUrl = `${this.baseApiUrl}/pets/delete/${petId}`;
        try{
            let response = await fetch(deleteUrl, {method: "DELETE"});
            if(response.status === 200){
                window.location.reload();
            } else{
                alert("Failed to delete pet. Please try again.");
            }
        } catch(error){
            console.error("Error deleting pets: ", error);
            alert("An error occured while deleting pet. Please try again.");
        }
    }

    createOrUpdatePet(petId){
        const updateUrl = `${this.baseApiUrl}/pets/update/${petId}`;
        const createUrl = `${this.baseApiUrl}/pets/`;

        const url = petId ? updateUrl : createUrl;
        return url;
    }
}
const petsApiService = new PetsApiService();
