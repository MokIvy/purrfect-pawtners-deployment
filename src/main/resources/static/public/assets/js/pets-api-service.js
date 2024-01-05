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
}
const petsApiService = new PetsApiService();
