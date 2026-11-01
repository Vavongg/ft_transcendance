NAME = transcendence

all: build up

build:
	docker compose build

up:
	docker compose up -d

down:
	docker compose down

clean:
	docker compose down -v

fclean: clean
	docker compose down -v --rmi all --remove-orphans

re: fclean all

status:
	docker compose ps

logs:
	docker compose logs -f

.PHONY: all build up down clean fclean re status logs