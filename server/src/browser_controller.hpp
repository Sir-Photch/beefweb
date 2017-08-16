#pragma once

#include "defines.hpp"
#include "controller.hpp"

namespace msrv {

class Router;
class SettingsStore;

class BrowserController : public ControllerBase
{
public:
    BrowserController(Request* request, SettingsStore* store);
    ~BrowserController();

    ResponsePtr getRoots();
    ResponsePtr getEntries();

    static void defineRoutes(Router* router, SettingsStore* store);

private:
    SettingsStore* store_;
};

}
