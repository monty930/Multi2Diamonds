import React, { useEffect, useState } from 'react';
import '../css/GreetForm.css';

function GreetForm() {
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    fetch('http://localhost:5197/helloworld')
      .then(response => response.json())
      .then(data => setMessage(data.message || "No data received"));
  }, []);

  const handleGreeting = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const name = formData.get('name');
    
    fetch('http://localhost:5197/helloworld/greet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    })
    .then(response => response.json())
    .then(data => setMessage(data.message));
  };

  return (
    <div className="GreetForm">
      <header className="GreetForm"></header>
        <form onSubmit={handleGreeting} className="greet-form">
          <input type="text" name="name" placeholder="Enter your name" />
          <button type="submit">Greet Me</button>
        </form>
        <p>{message}</p>
    </div>
  );
}

export default GreetForm;
