import {Request, Response} from "express";
import {handleUnauthorized} from "../../auth/service";

export async function multipleDelete(req: Request, res: Response) {
    const token = req.cookies.Authorization;
    fetch("http://localhost:8080/api/task/basic/delete", {
        method: "DELETE",
        credentials: "include",
        headers: {
            "Content-type": "application/json",
            "Authorization": token
        },
        body: JSON.stringify(req.body)
    }).then(response => {
        const status = response.status;
        if (status === 200) {
            res.status(200).send();
        } else if (status === 401) {
            handleUnauthorized(res);
        } else {
            res.status(status).send("Error");
        }
    });
}


export async function create(req: Request, res: Response) {
    const token = req.cookies.Authorization;
    const name = req.body.name;
    const description = req.body.description;

    await fetch("http://localhost:8080/api/task/basic/create", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            "Authorization": token
        },
        credentials: 'include',
        body: JSON.stringify({
            "name": name,
            "description": description
        })
    }).then(async response => {
        const status = response.status;
        if (status === 201) {
            return response.json();
        } else if (status === 400) {
            res.status(400);
            return;
        } else if (status === 401) {
            handleUnauthorized(res);
        }
    }).then(json => {
        if (json) {
            res.status(201).json(json);
        }
    })
}

export async function getAll(req: Request, res: Response) {
    const token = req.cookies.Authorization;
    fetch("http://localhost:8080/api/task/basic/getAll", {
        method: "GET",
        credentials: "include",
        headers: {
            "Authorization": token
        }
    }).then(response => {
        const status = response.status;
        if (status === 200) {
            return response.json();
        } else if (status === 401) {
            handleUnauthorized(res);
        }
    }).then(json => {
        if (json) {
            res.json(json);
        }
    })
}

