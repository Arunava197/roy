const doTest = async () => {
    try {
        const res = await fetch('http://localhost:3000/api/assistant', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({messages: [{role: 'user', content: 'hello'}], language: 'en'})
        });
        const text = await res.text();
        console.log(res.status, text);
    } catch(e) {
        console.error(e);
    }
}
doTest();
