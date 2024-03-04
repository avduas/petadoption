import React from 'react';

const Header = ({ user }) => {
    return (
        <>
            <header className="d-flex justify-content-center">
                <h1>Welcome, {user ? `${user.firstName} ${user.lastName}` : 'Guest'}!</h1>
            </header>
            <div className="text-left container mt-4 mb-4">
                <p>Welcome to PetAdopt, your go-to platform for finding the perfect furry companion! Our service is dedicated to connecting loving homes with adorable pets in need of adoption. Whether you're a passionate pet enthusiast or someone looking to bring a new, four-legged member into your family, PetAdopt is here to make the process simple and enjoyable.</p>
                <p>Explore a wide variety of pets from local shelters and rescue organizations. Our platform allows you to search for pets based on different criteria, ensuring you can find a furry friend that fits seamlessly into your lifestyle. From playful puppies and kittens to seasoned companions, we have a diverse range of pets waiting to find their forever homes.</p>
                <p>By signing up on PetAdopt, you gain access to a user-friendly interface where you can manage your adoption preferences, save your favorite profiles, and seamlessly navigate through the adoption process. Our goal is to create a seamless and enjoyable experience for both users and pets, fostering meaningful connections that last a lifetime.</p>
                <p>Join us in making a difference in the lives of these lovable animals. PetAdopt is more than a platform; it's a community dedicated to providing homes and happiness to pets in need. Start your journey with PetAdopt today and open your heart to a new, furry adventure!</p>
            </div>
        </>
    )
}

export default Header;
