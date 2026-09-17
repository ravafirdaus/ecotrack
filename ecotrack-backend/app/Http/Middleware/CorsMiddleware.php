<?php

namespace App\Http\Middleware;

use Closure;
use Fruitcake\Cors\CorsService;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CorsMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->is('api/*')) {
            return $next($request);
        }

        $cors = new CorsService(config('cors'));

        if (!$cors->isCorsRequest($request)) {
            return $next($request);
        }

        if ($cors->isPreflightRequest($request)) {
            return $cors->handlePreflightRequest($request);
        }

        return $cors->addActualRequestHeaders($next($request), $request);
    }
}
