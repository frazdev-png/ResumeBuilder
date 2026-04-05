import httpx
import asyncio

async def test():
    async with httpx.AsyncClient() as client:
        try:
            resp = await client.post('https://gemini.rudyy.workers.dev/chat', json={"message": "hello"}, timeout=10)
            print('POST JSON:', resp.status_code, resp.text)
        except Exception as e:
            print('POST JSON ERROR:', str(e))
            
        try:
            resp = await client.get('https://gemini.rudyy.workers.dev/chat', params={'message': 'hello'}, timeout=10)
            print('GET:', resp.status_code, resp.text)
        except Exception as e:
            print('GET ERROR:', str(e))

asyncio.run(test())
