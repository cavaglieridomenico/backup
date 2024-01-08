for D in ./*; do
    if [ -d "$D" ]; then
        cd "$D"
        gnome-terminal -- vtex deploy -f
        cd ..
    fi
done