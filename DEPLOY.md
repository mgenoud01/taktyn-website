# Déploiement — taktyn.ch

Site statique (HTML/CSS/JS), pas de build ni de Docker. Il tourne sur le même
VPS que mikedevnomad.com, servi par Caddy depuis `/var/www/taktyn`.

## 1. En local

```bash
git add -A
git commit -m "..."
git push
```

## 2. Sur le VPS

```bash
cd ~/taktyn-site
git pull
sudo cp -r ~/taktyn-site/* /var/www/taktyn/
sudo chown -R caddy:caddy /var/www/taktyn
```

Pas besoin de redémarrer Caddy — les fichiers statiques sont pris en compte immédiatement.

## Vérifier que ça a marché

```bash
curl -I https://taktyn.ch
```
