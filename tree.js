1. CHARGEMENT DE LA PAGE:
  View.bind('newTodo', handler) (11)                      view.js:254  // Appelé dans controller -> this.view.bind()
  View.bind('itemEdit', handler) (11)                     view.js:254  // Appelé dans controller -> this.view.bind()
  View._bindItemEditDone(handler) (9)                     view.js:195  // Appelé dans 'view.bind(event, handler)' - ligne 248
  View.bind('itemEditDone', handler) (11)                 view.js:254  // Appelé dans controller -> this.view.bind()
  View._bindItemEditCancel(handler) (10)                  view.js:209  // Appelé dans 'view.bind(event, handler)' - ligne 251
  View.bind('itemEditCancel', handler) (11)               view.js:254  // Appelés dans controller -> this.view.bind()
  View.bind('itemRemove', handler) (11)                   view.js:254
  View.bind('itemToggle', handler) (11)                   view.js:254
  View.bind('removeCompleted', handler) (11)              view.js:254
  View.bind('toggleAll', handler) (11)                    view.js:254
  Template.itemCounter(0) (2)                             template.js:108  // Appelé dans 'view.render(viewCmd, parameter)' - ligne 134
  View.render(updateElementCount, 0) (7)                  view.js:164  // Appelé dans 'controller._updateCount()' - ligne 284
  View._clearCompletedButton(0, false) (2)                view.js:47  // Appelé dans 'view.render(viewCmd, parameter)' - ligne 137
  View.render(clearCompletedButton, [object Object]) (7)  view.js:164
  View.render(toggleAll, [object Object]) (7)             view.js:164  // Appelé dans 'controller._updateCount()' - ligne 290
  View.render(contentBlockVisibility, [object Object]) (7)view.js:164  // Appelé dans 'controller._updateCount()' - ligne 291
  Store.findAll(callback) (2)                             store.js:118  // Appelé dans 'model.getCount(callback)' - ligne 123 & 'model.read(query, calback)' - ligne 54
  Model.getCount(callback) (6)                            model.js:141  // Appelé dans 'controller._updateCount()' - ligne 283
  Controller._updateCount() (13)                          controller.js:294  // Appelé dans 'controller._filter()' - ligne 305
  Template.show() (1)                                     template.js:95  // Appelé dans 'view.render(viewCmd, parameter)' - ligne 128
  View.render(showEntries, ) (7)                          view.js:164  // Appelé dans 'controller.showAll()' - ligne 85
  Store.findAll(callback) (2)                             store.js:118 // Appelé dans 'model.getCount(callback)' - ligne 123 & 'model.read(query, calback)' - ligne 54
  Controller.showAll() (2)                                controller.js:88  // ?? qui appelle showAll ??
  Controller._filter(undefined) (14)                      controller.js:316
  View._setFilter() (3)                                   view.js:58  // Appelé dans 'view.render(viewCmd, parameter)' - ligne 146
  View.render(setFilter, ) (7)                            view.js:164 // Appelé dans 'controller._updateFilterState(currentPage)' - ligne 333
  Controller._updateFilterState() (15)                    controller.js:335  // Appelé dans 'controller.setView(locationHash)' - ligne 71
  Controller.setView() (1)                                controller.js:73  // Appelé dans 'app.js > function serview()'

2. RENTRER UN TODO:
  View.render(clearNewTodo, undefined) (7)                  view.js:164
  Template.itemCounter(1) (2)                               template.js:108
  View.render(updateElementCount, 1) (7)                    view.js:164
  View._clearCompletedButton(0, false) (2)                  view.js:47
  View.render(clearCompletedButton, [object Object]) (7)    view.js:164
  View.render(toggleAll, [object Object]) (7)               view.js:164
  View.render(contentBlockVisibility, [object Object]) (7)  view.js:164
  Store.findAll(callback) (2)                               store.js:118
  Model.getCount(callback) (6)                              model.js:141
  Controller._updateCount() (13)                            controller.js:294
  Template.show([object Object]) (1)                        template.js:95
  View.render(showEntries, [object Object]) (7)             view.js:164
  Store.findAll(callback) (2)                               store.js:118
  Controller.showAll() (2)                                  controller.js:88
  Controller._filter(true) (14)                             controller.js:316
  Store.save([object Object], callback, undefined) (3)      store.js:172
  Model.create(ezaze, callback) (1)                         model.js:30
  Controller.addItem(ezaze) (5)                             controller.js:137

3. EDITER UN TODO:
  View._editItem(826556, ezaze) (5)                         view.js:99
  View.render(editItem, [object Object]) (7)                view.js:164
  Store.find([object Object], callback) (1)                 store.js:104
  Model.read(826556, function (data) {
      self.view.render('editItem', {id: id, title: data[0].title});
    }) (2)                                                  model.js:69
  Controller.editItem(826556) (6)                           controller.js:149

4. CLORE L'ÉDITION:
  View._editItemDone(826556, ezaze) (6)
  View.render(editItemDone, [object Object]) (7)            view.js:164
  Store.save([object Object], callback, 826556) (3)         store.js:172
  Model.update(826556, [object Object], callback) (3)       model.js:84
  Controller.editItemSave(826556, ezaze) (7)                controller.js:181

5. SELECTIONNER UN TODO:
  View._elementComplete(826556, true) (4)                     view.js:75
  View.render(elementComplete, [object Object]) (7)           view.js:164
  Store.save([object Object], callback, 826556) (3)           store.js:172
  Model.update(826556, [object Object], callback) (3)         model.js:84
  Template.itemCounter(0) (2)                                 template.js:108
  View.render(updateElementCount, 0) (7)                      view.js:164
  View._clearCompletedButton(1, true) (2)                     view.js:47
  View.render(clearCompletedButton, [object Object]) (7)      view.js:164
  View.render(toggleAll, [object Object]) (7)                 view.js:164
  View.render(contentBlockVisibility, [object Object]) (7)    view.js:164
  Store.findAll(callback) (2)                                 store.js:118
  Model.getCount(callback) (6)                                model.js:141
  Controller._updateCount() (13)                              controller.js:294
  Controller._filter(undefined) (14)                          controller.js:316
  Controller.toggleComplete(826556, true, undefined) (11)     controller.js:258

6. SELECTIONNER TOUS LES TODOS:
  // Cette séquence se répète pour tous les todos:
  View._elementComplete(826556, true) (4)                     view.js:75
  View.render(elementComplete, [object Object]) (7)           view.js:164
  Store.save([object Object], callback, 826556) (3)           store.js:172
  Model.update(826556, [object Object], callback) (3)         model.js:84
  // Fin de la séquence par todo, suite du programme:
  Controller.toggleComplete(826556, true, true) (11)          controller.js:258
  Store.find([object Object], callback) (1)                   store.js:104
  Model.read([object Object], function (data) {
  			data.forEach(function (item) {
  				self.toggleComplete(item.id, completed, true);
  			});
  		}) (2)                                                  model.js:69
  Template.itemCounter(0) (2)                                 template.js:108
  View.render(updateElementCount, 0) (7)                      view.js:164
  View._clearCompletedButton(1, true) (2)                     view.js:47
  View.render(clearCompletedButton, [object Object]) (7)      view.js:164
  View.render(toggleAll, [object Object]) (7)                 view.js:164
  View.render(contentBlockVisibility, [object Object]) (7)    view.js:164
  Store.findAll(callback) (2)                                 store.js:118
  Model.getCount(callback) (6)                                model.js:141
  Controller._updateCount() (13)                              controller.js:294
  Controller._filter(undefined) (14)                          controller.js:316
  Controller.toggleAll(true) (12)                             controller.js:275

8. DESELECTIONNER TOUS LES TODOS:
  View._elementComplete(826556, false) (4)                    view.js:75
  View.render(elementComplete, [object Object]) (7)           view.js:164
  Store.save([object Object], callback, 826556) (3)           store.js:172
  Model.update(826556, [object Object], callback) (3)         model.js:84
  Controller.toggleComplete(826556, false, true) (11)         controller.js:258
  Store.find([object Object], callback) (1)                   store.js:104
  Model.read([object Object], function (data) {
  			data.forEach(function (item) {
  				self.toggleComplete(item.id, completed, true);
  			});
  		}) (2)                                                  model.js:69
  Template.itemCounter(1) (2)                                 template.js:108
  View.render(updateElementCount, 1) (7)                      view.js:164
  View._clearCompletedButton(0, false) (2)                    view.js:47
  View.render(clearCompletedButton, [object Object]) (7)      view.js:164
  View.render(toggleAll, [object Object]) (7)                 view.js:164
  View.render(contentBlockVisibility, [object Object]) (7)    view.js:164
  Store.findAll(callback) (2)                                 store.js:118
  Model.getCount(callback) (6)                                model.js:141
  Controller._updateCount() (13)                              controller.js:294
  Controller._filter(undefined) (14)                          controller.js:316
  Controller.toggleAll(false) (12)                            controller.js:275

9. SUPPRIMER UN TODO:
  Store.findAll(callback) (2)                                 store.js:118
  View._removeItem(826556) (1)                                view.js:38
  View.render(removeItem, 826556) (7)                         view.js:164
  Store.remove(826556, callback) (4)                          store.js:209
  Model.remove(826556, callback) (4)                          model.js:96
  Template.itemCounter(0) (2)                                 template.js:108
  View.render(updateElementCount, 0) (7)                      view.js:164
  View._clearCompletedButton(0, false) (2)                    view.js:47
  View.render(clearCompletedButton, [object Object]) (7)      view.js:164
  View.render(toggleAll, [object Object]) (7)                 view.js:164
  View.render(contentBlockVisibility, [object Object]) (7)    view.js:164
  Store.findAll(callback) (2)                                 store.js:118
  Model.getCount(callback) (6)                                model.js:141
  Controller._updateCount() (13)                              controller.js:294
  Controller._filter(undefined) (14)                          controller.js:316
  Controller.removeItem(826556) (9)                           controller.js:220

10. AFFICHER TOUS LES TODOS:
  Template.itemCounter(3) (2)                               template.js:108
  View.render(updateElementCount, 3) (7)                    view.js:164
  View._clearCompletedButton(0, false) (2)                  view.js:47
  View.render(clearCompletedButton, [object Object]) (7)    view.js:164
  View.render(toggleAll, [object Object]) (7)               view.js:164
  View.render(contentBlockVisibility, [object Object]) (7)  view.js:164
  Store.findAll(callback) (2)                               store.js:118
  Model.getCount(callback) (6)                              model.js:141
  Controller._updateCount() (13)                            controller.js:294
  Controller._filter(undefined) (14)                        controller.js:316
  View._setFilter() (3)                                     view.js:58
  View.render(setFilter, ) (7)                              view.js:164
  Controller._updateFilterState() (15)                      controller.js:335
  Controller.setView(#/) (1)                                controller.js:73

11. AFFICHER LES TODOS ACTIFS:
  Template.itemCounter(3) (2)                             template.js:108
  View.render(updateElementCount, 3) (7)                  view.js:164
  View._clearCompletedButton(0, false) (2)                view.js:47
  View.render(clearCompletedButton, [object Object]) (7)  view.js:164
  View.render(toggleAll, [object Object]) (7)             view.js:164
  View.render(contentBlockVisibility, [object Object]) (7)view.js:164
  Store.findAll(callback) (2)                             store.js:118
  Model.getCount(callback) (6)                            model.js:141
  Controller._updateCount() (13)                          controller.js:294
  Template.show([object Object],[object Object],[object Object]) (1)  template.js:95
  View.render(showEntries, [object Object],[object Object],[object Object]) (7) view.js:164
  Store.find([object Object], callback) (1)               store.js:104
  Model.read([object Object], function (data) {
  			self.view.render('showEntries', data);
  		}) (2)                                              model.js:69
  Controller.showActive() (3)                             controller.js:100
  Controller._filter(undefined) (14)                      controller.js:316
  View._setFilter(active) (3)                             view.js:58
  View.render(setFilter, active) (7)                      view.js:164
  Controller._updateFilterState(active) (15)              controller.js:335
  Controller.setView(#/active) (1)                        controller.js:73

12. AFFICHER LES TODOS COMPLETES:
  Template.itemCounter(3) (2)                             template.js:108
  View.render(updateElementCount, 3) (7)                  view.js:164
  View._clearCompletedButton(0, false) (2)                view.js:47
  View.render(clearCompletedButton, [object Object]) (7)  view.js:164
  View.render(toggleAll, [object Object]) (7)             view.js:164
  View.render(contentBlockVisibility, [object Object]) (7)view.js:164
  Store.findAll(callback) (2)                             store.js:118
  Model.getCount(callback) (6)                            model.js:141
  Controller._updateCount() (13)                          controller.js:294
  Template.show() (1)                                     template.js:95
  View.render(showEntries, ) (7)                          view.js:164
  Store.find([object Object], callback) (1)               store.js:104
  Model.read([object Object], function (data) {
  			self.view.render('showEntries', data);
  		}) (2)                                              model.js:69
  Controller.showCompleted() (4)                          controller.js:112
  Controller._filter(undefined) (14)                      controller.js:316
  View._setFilter(completed) (3)                          view.js:58
  View.render(setFilter, completed) (7)                   view.js:164
  Controller._updateFilterState(completed) (15)           controller.js:335
  Controller.setView(#/completed) (1)                     controller.js:73

13. CLEAR LES TODOS COMPLETED:
  // Cette première séquence se répète pour chaque todo:
  Store.findAll(callback) (2)                               store.js:118
  View._removeItem(571934) (1)                              view.js:38
  View.render(removeItem, 571934) (7)                       view.js:164
  Store.remove(571934, callback) (4)                        store.js:209
  Model.remove(571934, callback) (4)                        model.js:96
  Template.itemCounter(0) (2)                               template.js:108
  View.render(updateElementCount, 0) (7)                    view.js:164
  View._clearCompletedButton(4, true) (2)                   view.js:47
  View.render(clearCompletedButton, [object Object]) (7)    view.js:164
  View.render(toggleAll, [object Object]) (7)               view.js:164
  View.render(contentBlockVisibility, [object Object]) (7)  view.js:164
  Store.findAll(callback) (2)                               store.js:118
  Model.getCount(callback) (6)                              model.js:141
  Controller._updateCount() (13)                            controller.js:294
  Controller._filter(undefined) (14)                        controller.js:316
  Controller.removeItem(571934) (9)                         controller.js:220
  // Après les todos l'appli continue ici:
  Store.find([object Object], callback) (1)                 store.js:104
  Model.read([object Object], function (data) {
      data.forEach(function (item) {
        self.removeItem(item.id);
      });
    }) (2)                                                  model.js:69
  Template.itemCounter(0) (2)                               template.js:108
  View.render(updateElementCount, 0) (7)                    view.js:164
  View._clearCompletedButton(0, false) (2)                  view.js:47
  View.render(clearCompletedButton, [object Object]) (7)    view.js:164
  View.render(toggleAll, [object Object]) (7)               view.js:164
  View.render(contentBlockVisibility, [object Object]) (7)  view.js:164
  Store.findAll(callback) (2)                               store.js:118
  Model.getCount(callback) (6)                              model.js:141
  Controller._updateCount() (13)                            controller.js:294
  Controller._filter(undefined) (14)                        controller.js:316
  Controller.removeCompletedItems() (10)                    controller.js:236
