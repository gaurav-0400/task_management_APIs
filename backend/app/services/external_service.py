import httpx
from fastapi import HTTPException, status


EXTERNAL_USERS_URL = "https://jsonplaceholder.typicode.com/users"


async def fetch_external_users():
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(EXTERNAL_USERS_URL)

            response.raise_for_status()

            data = response.json()

            return [
                {
                    "id": user["id"],
                    "name": user["name"],
                    "email": user["email"],
                    "company": user["company"]["name"],
                }
                for user in data
            ]

    except httpx.TimeoutException:
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail="External API request timed out.",
        )

    except httpx.HTTPStatusError:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="External API returned an error.",
        )

    except httpx.RequestError:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Unable to reach external API.",
        )