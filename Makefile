.PHONY: build-raids-lua deploy-raids-lua build-admin-client prep-raids post-raids

POSTGAME_TIMESTAMP ?= 5000

build-raids-lua:
	cd sapp; \
	python3 bundler.py

deploy-raids-lua:
	cd sapp; \
	cp Raids.lua ../../../lua/Raids.lua

build-admin-client:
	cd admin-client; \
	npm run build; \
	cd ../admin-client-app; \
	npm i

build-admin-client-clean:
	cd admin-client; \
	npm run build:clean && npm run build; \
	cd ../admin-client-app; \
	npm i

prep-raids:
	cd admin-client-app; \
	npm run build-config; \
	cd ..; \
	cp raids.config.json '/mnt/c/Program Files (x86)/Microsoft Games/sapp/raids.config.json'

post-raids:
	cp "/mnt/c/Program Files (x86)/Microsoft Games/sapp/raids.$(POSTGAME_TIMESTAMP).postgame" ./raids.postgame; \
	cd admin-client-app; \
	npm run process-postgame-file; \
	cd ..;\
	rm raids.postgame

clean-post-raids:
	cd "/mnt/c/Program Files (x86)/Microsoft Games/sapp";\
	rm raids.*.postgame




