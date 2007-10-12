#$Id:$

all: clc_utils.xpi

clc_utils.xpi:
	cd chrome && $(MAKE)
	zip clc_utils.xpi chrome/clc_utils.jar   install.rdf
