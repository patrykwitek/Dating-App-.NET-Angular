import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from "@angular/router";

export class CustomRouteReuseStrategy implements RouteReuseStrategy {
    // note: klasa ta służy do odświeżenia komponentu Messages, gdy przyjdzie powiadomienie
    // bez tego użytkownik po kliknięciu w powiadomienie nowej wiadomości przechodzi do strony użytkownika wysyłającego wiadomość, ale bez odświeżenia komponentu z wiadomościami

    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        return false;
    }

    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
    }

    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        return false;
    }

    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
        return null;
    }

    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        // note: shouldReuseRoute to metoda, dzięki której stary komponent zostanie przeładowany
        return false;
    }

}