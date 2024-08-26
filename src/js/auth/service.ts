import {Request, Response} from 'express';

export async function isAuthenticated(req: Request) {
    const token = req.cookies.Authorization as string;
    let status;

    if (token != null && token.startsWith("Bearer ")) {
        await fetch("http://localhost:8080/api/auth/check", {
            method: "POST",
            headers: {
                "Authorization": token
            }
        }).then(response => {
            status = response.status;
        })
    }
    return status == 200;
}

export function makeLogoutRequest(req: Request, res: Response, link: string): void {
    const token = req.cookies.Authorization as string;
    if (token) {
        fetch(link, {
            method: "POST",
            headers: {
                "Authorization": token
            }
        })
        res.cookie("Authorization", "", {
            httpOnly: true,
            maxAge: 1,
            sameSite: "strict"
        })
        res.redirect("/login");
    }
}

export function makeAuthRequest(req: Request, res: Response, link: string): void {
    const username = req.body.username as string;
    const password = req.body.password as string;

    fetch(link, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "username": username,
            "password": password
        })
    }).then(response => {
        const status = response.status as number;
        console.log("Status: " + status);
        if (status === 200) {
            const token = response.headers.get("Authorization") as string;
            res.cookie("Authorization", token, {
                httpOnly: true,
                maxAge: 2419200000, //28d
                sameSite: "strict"
                //, secure: true //TODO: uncomment for HTTPS
            });
            res.status(200).send();
        } else {
            res.status(status).send();
        }
    })
}

export function handleUnauthorized(res: Response) {
    res.cookie("Authorization", "", {
        httpOnly: true,
        maxAge: 1,
        sameSite: "strict"
    }).redirect("/login")
    throw Error("Unauthorized");
}