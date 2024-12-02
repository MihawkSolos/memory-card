import { useState, useEffect } from 'react';
import '../styles/Fetch.css';

export function Fetch() {
    const [pokemonList, setPokemonList] = useState([]); // to update my current list
    const [shownCards, setShownCards] = useState([]); // to update displayed cards
    const [clickedCards, setClickedCards] = useState(new Set()); // track the clicked cards
    const [gameOver, setGameOver] = useState(false);

    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0); // track the user high score

    // update counter when clicked
    const handleCounter = () => { 
        setScore((prevScore) => prevScore + 1);
    }

    // fetch data from PokeAPI
    useEffect(() => {
        const getPokemon = async () => {
            try {
                const response = await fetch('https://pokeapi.co/api/v2/generation/1/', { mode: 'cors' });
                const pokemonData = await response.json();
                
                //console.log(pokemonData);

                // list of objects with name and url for image
                const pokemonWithImages = pokemonData.pokemon_species.map((pokemon) => ({
                    name: pokemon.name,
                    imageUrl: pokemon.url.replace('https://pokeapi.co/api/v2/pokemon-species/', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/')
                    .replace(/\/$/, '')
                    + '.png',
                }));

                //console.log(pokemonWithImages);

                setPokemonList(pokemonWithImages);

            } catch (error) {
                console.error("Error fetching Pokémon data:", error);
            }
        };

        getPokemon();
    }, []);


    // have 10 random cards appear on initial render 
    useEffect(() => {
        if (pokemonList.length > 0) {
            shuffleCards();
        }
    }, [pokemonList]);


    // shuffle the full list of pokemonlist to get different ones
    const shuffleCards = () => {
        // Shuffle Pokémon list while keeping name and image together
        const shuffled = [...pokemonList].sort(() => Math.random() - 0.5); // give random values between -0.5 and 0.5
        const selectedCards = shuffled.slice(0, 10); // pick first 10 cards
        setShownCards(selectedCards);
    };


    // Handle card click
    const handleCardClick = (pokemonName) => {
        if (gameOver) return; // Don't allow clicking after game is over
        
        if (clickedCards.has(pokemonName)) {
            // Game over if card is clicked again
            setGameOver(true);
            alert('Game Over! You clicked on a card you already selected.');

            setHighScore((prevHighScore) => Math.max(prevHighScore, score)); // update high score
        } else {
            // add clicked pokemon to set
            setClickedCards(prev => new Set(prev).add(pokemonName));
            handleCounter(); // update counter
            // shuffle again
            shuffleCards();
        }
    };

    const newGame = () => {
        setGameOver(false);
        setScore(0);
        setClickedCards(new Set());
        shuffleCards();
    }

    return (
        <>
            <h1 className='title'>Pokémon Memory Card Game</h1>
            <div className="scoreBox">
                <p className="score"><b>Score:</b> {score}</p>
                <p className="highScore"><b>High Score:</b> {highScore}</p>
            </div>
            <div className="cardsContainer">
                {!gameOver ? (shownCards.map((pokemon, index) => (
                    <div key={index} className="card" onClick={() => handleCardClick(pokemon.name)}>
                        <img
                            src={pokemon.imageUrl}  // Correct image URL paired with name
                            alt={pokemon.name}
                        />
                        <p>{pokemon.name}</p>
                    </div>
                ))) : (
                    <div className='btnContainer'>
                        <button 
                        className='newGame'
                        type="button"
                        onClick={newGame}
                        >New Game</button>
                        <h2>Game Over! You clicked on a card you've already selected.</h2>
                    </div>
                )}
            </div>
            
        </>
    );
}
